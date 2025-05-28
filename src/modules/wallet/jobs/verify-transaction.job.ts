import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionStatus, TransactionType } from '../entities/transaction.entity';
import { PaystackService } from '../paystack.service';
import { WalletService } from '../wallet.service';
import { Not, IsNull } from 'typeorm';
import { Wallet } from '../entities/wallet.entity';

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
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleVerification() {
    // console.log('Verifying transactions...');
    const pendingTransactions = await this.transactionRepository.find({
      where: [
        {
          status: TransactionStatus.PENDING,
          reference: Not(IsNull()),
        },
        {
          status: TransactionStatus.ABANDONED,
          reference: Not(IsNull()),
        }
      ],
    });
    console.log('Pending transactions:', pendingTransactions);
    for (const transaction of pendingTransactions) {
      console.log('Verifying transaction...', transaction.reference);
      try {
        if (!transaction.walletId) {
          this.logger.error(`Transaction ${transaction.reference} has no associated walletId`);
          continue;
        }

        const verification = await this.paystackService.verifyTransaction(transaction.reference);
        const status = verification.data.status;
        console.log('Verification response:', verification.data);

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

        // Update transaction status and wallet balance in a transaction
        await this.transactionRepository.manager.transaction(async (manager) => {
          // Update transaction status
          transaction.status = newStatus;
          await manager.save(transaction);

          // If transaction is successful, update wallet balance
          if (newStatus === TransactionStatus.SUCCESS) {
            const wallet = await manager.findOne(Wallet, { where: { id: transaction.walletId } });
            if (wallet) {
              console.log('Updating wallet balance:', {
                walletId: wallet.id,
                currentBalance: wallet.balance,
                amount: transaction.amount,
                newBalance: Number(wallet.balance) + Number(transaction.amount)
              });
              
              wallet.balance = Number(wallet.balance) + Number(transaction.amount);
              await manager.save(wallet);
            } else {
              this.logger.error(`Wallet not found for transaction ${transaction.reference}`);
            }
          }
        });

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