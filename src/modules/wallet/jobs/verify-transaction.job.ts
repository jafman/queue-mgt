import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionStatus, TransactionType } from '../entities/transaction.entity';
import { PaystackService } from '../paystack.service';
import { WalletService } from '../wallet.service';
import { Not, IsNull } from 'typeorm';

@Injectable()
export class VerifyTransactionJob {
  private readonly logger = new Logger(VerifyTransactionJob.name);
  private readonly MAX_ATTEMPTS = 20;
  private readonly POLL_INTERVAL = 30000; // 30 seconds

  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private paystackService: PaystackService,
    private walletService: WalletService,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleVerification() {
    // console.log('Verifying transactions...');
    const pendingTransactions = await this.transactionRepository.find({
      where: {
        status: TransactionStatus.PENDING,
        reference: Not(IsNull()),
      },
      relations: ['wallet'],
    });
    console.log('Pending transactions:', pendingTransactions.length);
    for (const transaction of pendingTransactions) {
      console.log('Verifying transaction...', transaction.reference);
      try {
        if (!transaction.wallet) {
          this.logger.error(`Transaction ${transaction.reference} has no associated wallet`);
          continue;
        }

        const verification = await this.paystackService.verifyTransaction(transaction.reference);
        const status = verification.data.status;
        console.log({verificationData: verification.data})
        // Map Paystack status to our TransactionStatus
        let newStatus: TransactionStatus;
        switch (status) {
          case 'success':
            newStatus = TransactionStatus.SUCCESS;
            break;
          case 'failed':
            newStatus = TransactionStatus.FAILED;
            break;
          case 'abandoned':
            newStatus = TransactionStatus.ABANDONED;
            break;
          case 'reversed':
            newStatus = TransactionStatus.REVERSED;
            break;
          default:
            newStatus = TransactionStatus.PENDING;
        }

        // Update transaction status
        transaction.status = newStatus;
        await this.transactionRepository.save(transaction);

        // If transaction is successful, update wallet balance
        if (newStatus === TransactionStatus.SUCCESS) {
          const wallet = await this.walletService.getOrCreateWallet(
            transaction.wallet.userId,
            transaction.wallet.userType
          );
          wallet.balance += transaction.amount;
          await this.walletService.updateWalletBalance(wallet);
        }

        this.logger.log(`Transaction ${transaction.reference} status updated to ${newStatus}`);
      } catch (error) {
        this.logger.error(
          `Failed to verify transaction ${transaction.reference}`,
          error.message,
        );
      }
    }
  }
} 