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
import { CreateTransferDto, RecipientType } from './dto/create-transfer.dto';

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
      wallet = await this.walletRepository.save(wallet);
      console.log('Created new wallet:', { userId, userType, walletId: wallet.id });
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

  async transfer(
    senderId: string,
    senderType: string,
    createTransferDto: CreateTransferDto,
  ): Promise<Transaction> {
    // Only students can transfer
    if (senderType !== 'student') {
      throw new BadRequestException('Only students can make transfers');
    }

    // Get sender's wallet
    const senderWallet = await this.getOrCreateWallet(senderId, senderType);

    // Get sender's information
    const sender = await this.studentRepository.findOne({
      where: { id: senderId }
    });

    if (!sender) {
      throw new NotFoundException('Sender not found');
    }

    // Find recipient based on username and type
    let recipient: Student | Vendor | null;
    if (createTransferDto.recipientType === RecipientType.STUDENT) {
      recipient = await this.studentRepository.findOne({
        where: { username: createTransferDto.recipientUsername }
      });
    } else {
      recipient = await this.vendorRepository.findOne({
        where: { username: createTransferDto.recipientUsername }
      });
    }

    if (!recipient) {
      throw new NotFoundException('Recipient not found');
    }

    // Prevent self-transfer
    if (recipient.id === senderId) {
      throw new BadRequestException('Cannot transfer to yourself');
    }

    // Get or create recipient's wallet
    const recipientWallet = await this.getOrCreateWallet(
      recipient.id,
      createTransferDto.recipientType
    );

    // Check if there's sufficient balance
    if (senderWallet.balance < createTransferDto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    console.log('Before transfer:', {
      senderBalance: senderWallet.balance,
      recipientBalance: recipientWallet.balance,
      amount: createTransferDto.amount
    });

    // Create debit transaction for sender
    const senderTransaction = this.transactionRepository.create({
      amount: createTransferDto.amount,
      type: TransactionType.DEBIT,
      description: `Transfer to ${createTransferDto.recipientUsername}`,
      walletId: senderWallet.id,
      relatedUserId: recipient.id,
    });

    // Create credit transaction for recipient
    const recipientTransaction = this.transactionRepository.create({
      amount: createTransferDto.amount,
      type: TransactionType.CREDIT,
      description: `Transfer from ${sender.username}`,
      walletId: recipientWallet.id,
      relatedUserId: senderId,
    });

    // Update balances
    senderWallet.balance = Number(senderWallet.balance) - Number(createTransferDto.amount);
    recipientWallet.balance = Number(recipientWallet.balance) + Number(createTransferDto.amount);

    console.log('After balance update:', {
      senderBalance: senderWallet.balance,
      recipientBalance: recipientWallet.balance
    });

    // Save everything in a transaction
    const result = await this.transactionRepository.manager.transaction(async (manager) => {
      const savedSenderTransaction = await manager.save(senderTransaction);
      await manager.save(recipientTransaction);
      await manager.save(senderWallet);
      await manager.save(recipientWallet);
      return savedSenderTransaction;
    });

    // Verify balances after transfer
    const updatedSenderWallet = await this.walletRepository.findOne({
      where: { id: senderWallet.id }
    });
    const updatedRecipientWallet = await this.walletRepository.findOne({
      where: { id: recipientWallet.id }
    });

    if (!updatedSenderWallet || !updatedRecipientWallet) {
      throw new Error('Failed to verify wallet updates');
    }

    console.log('Transfer completed:', {
      senderBalance: updatedSenderWallet.balance,
      recipientBalance: updatedRecipientWallet.balance,
      amount: createTransferDto.amount
    });

    return result;
  }

  async validateUsername(username: string): Promise<{ 
    fullName: string;
    userType: 'student' | 'vendor' | null;
    exists: boolean;
  }> {
    // Check student first
    const student = await this.studentRepository.findOne({
      where: { username }
    });

    if (student) {
      return {
        fullName: `${student.firstName} ${student.lastName}`.trim(),
        userType: 'student',
        exists: true
      };
    }

    // Check vendor if not found in students
    const vendor = await this.vendorRepository.findOne({
      where: { username }
    });

    if (vendor) {
      return {
        fullName: vendor.business_name,
        userType: 'vendor',
        exists: true
      };
    }

    // Return not found response
    return {
      fullName: '',
      userType: null,
      exists: false
    };
  }
} 