import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { StudentService } from '../users/student/student.service';
import { VendorService } from '../users/vendor/vendor.service';
import { AuthService } from '../../auth/services/auth.service';
import { Student } from '../users/entities/student.entity';
import { Vendor } from '../users/entities/vendor.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
    private studentService: StudentService,
    private vendorService: VendorService,
    private authService: AuthService,
  ) {}

  async getOrCreateWallet(userId: string, userType: string): Promise<Wallet> {
    let wallet = await this.walletRepository.findOne({
      where: { userId, userType },
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

  async getWalletBalance(userId: string, userType: string): Promise<{ balance: number; email: string }> {
    const wallet = await this.getOrCreateWallet(userId, userType);
    console.log({userId, userType});
    let email = 'Email not found';
    if (userType === 'student') {
      const student = await this.studentRepository.findOne({ where: { id: userId } });
      if (student?.email) {
        email = student.email;
      }
    } else if (userType === 'vendor') {
      const vendor = await this.vendorRepository.findOne({ where: { id: userId } });
      if (vendor?.email) {
        email = vendor.email;
      }
    }

    return { 
      balance: wallet.balance,
      email
    };
  }

  async createTransaction(
    userId: string,
    userType: string,
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const wallet = await this.getOrCreateWallet(userId, userType);
    console.log({wallet, createTransactionDto})
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
        walletId: wallet.id,
        type: TransactionType.DEBIT,
        relatedUserId: recipientWallet.userId,
      });

      // Create credit transaction for recipient
      const recipientTransaction = this.transactionRepository.create({
        ...createTransactionDto,
        walletId: recipientWallet.id,
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
      walletId: wallet.id,
    });

    if (createTransactionDto.type === TransactionType.CREDIT) {
      wallet.balance += createTransactionDto.amount;
    } else {
      wallet.balance -= createTransactionDto.amount;
    }

    // Save both transaction and wallet in a transaction to ensure atomicity
    await this.transactionRepository.manager.transaction(async (manager) => {
      await manager.save(transaction);
      await manager.save(wallet);
    });

    return transaction;
  }

  async getTransactionHistory(
    userId: string,
    userType: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ 
    transactions: Transaction[]; 
    total: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }> {
    const wallet = await this.getOrCreateWallet(userId, userType);

    const [transactions, total] = await this.transactionRepository.findAndCount({
      where: { walletId: wallet.id },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return { 
      transactions, 
      total,
      currentPage: page,
      totalPages,
      hasNextPage,
      hasPreviousPage
    };
  }

  async updateWalletBalance(wallet: Wallet) {
    return this.walletRepository.save(wallet);
  }
} 