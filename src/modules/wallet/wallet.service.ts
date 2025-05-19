import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async getOrCreateWallet(userId: string, userType: string): Promise<Wallet> {
    let wallet = await this.walletRepository.findOne({
      where: { userId, userType },
      relations: ['transactions'],
    });

    if (!wallet) {
      wallet = this.walletRepository.create({
        userId,
        userType,
        balance: 0,
      });
      await this.walletRepository.save(wallet);
    }

    return wallet;
  }

  async getWalletBalance(userId: string, userType: string): Promise<number> {
    const wallet = await this.getOrCreateWallet(userId, userType);
    return wallet.balance;
  }

  async createTransaction(
    userId: string,
    userType: string,
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const wallet = await this.getOrCreateWallet(userId, userType);

    // Handle transfers
    if (createTransactionDto.recipientId && createTransactionDto.recipientType) {
      // Only students can transfer to vendors
      if (userType !== 'student' || createTransactionDto.recipientType !== 'vendor') {
        throw new BadRequestException('Only students can transfer to vendors');
      }

      // Check if recipient exists
      const recipientWallet = await this.getOrCreateWallet(
        createTransactionDto.recipientId,
        createTransactionDto.recipientType,
      );

      // Check if there's sufficient balance
      if (wallet.balance < createTransactionDto.amount) {
        throw new BadRequestException('Insufficient balance');
      }

      // Create debit transaction for sender
      const senderTransaction = this.transactionRepository.create({
        ...createTransactionDto,
        wallet,
        type: TransactionType.DEBIT,
        relatedUserId: recipientWallet.userId,
      });

      // Create credit transaction for recipient
      const recipientTransaction = this.transactionRepository.create({
        ...createTransactionDto,
        wallet: recipientWallet,
        type: TransactionType.CREDIT,
        relatedUserId: wallet.userId,
      });

      // Update balances
      wallet.balance -= createTransactionDto.amount;
      recipientWallet.balance += createTransactionDto.amount;

      // Save everything in a transaction
      await this.transactionRepository.manager.transaction(async (manager) => {
        await manager.save(senderTransaction);
        await manager.save(recipientTransaction);
        await manager.save(wallet);
        await manager.save(recipientWallet);
      });

      return senderTransaction;
    }

    // Handle regular credit/debit transactions
    if (createTransactionDto.type === TransactionType.DEBIT && wallet.balance < createTransactionDto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    const transaction = this.transactionRepository.create({
      ...createTransactionDto,
      wallet,
    });

    if (createTransactionDto.type === TransactionType.CREDIT) {
      wallet.balance += createTransactionDto.amount;
    } else {
      wallet.balance -= createTransactionDto.amount;
    }

    await this.transactionRepository.save(transaction);
    await this.walletRepository.save(wallet);

    return transaction;
  }

  async getTransactionHistory(
    userId: string,
    userType: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ transactions: Transaction[]; total: number }> {
    const wallet = await this.getOrCreateWallet(userId, userType);

    const [transactions, total] = await this.transactionRepository.findAndCount({
      where: { wallet: { id: wallet.id } },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { transactions, total };
  }
} 