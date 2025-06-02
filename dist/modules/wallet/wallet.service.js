"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const wallet_entity_1 = require("./entities/wallet.entity");
const transaction_entity_1 = require("./entities/transaction.entity");
const student_service_1 = require("../users/student/student.service");
const vendor_service_1 = require("../users/vendor/vendor.service");
const auth_service_1 = require("../../auth/services/auth.service");
const student_entity_1 = require("../users/entities/student.entity");
const vendor_entity_1 = require("../users/entities/vendor.entity");
const create_transfer_dto_1 = require("./dto/create-transfer.dto");
let WalletService = class WalletService {
    walletRepository;
    transactionRepository;
    studentRepository;
    vendorRepository;
    studentService;
    vendorService;
    authService;
    constructor(walletRepository, transactionRepository, studentRepository, vendorRepository, studentService, vendorService, authService) {
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
        this.studentRepository = studentRepository;
        this.vendorRepository = vendorRepository;
        this.studentService = studentService;
        this.vendorService = vendorService;
        this.authService = authService;
    }
    async getOrCreateWallet(userId, userType) {
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
    async getWalletBalance(userId, userType) {
        const wallet = await this.getOrCreateWallet(userId, userType);
        console.log({ userId, userType });
        let email = 'Email not found';
        if (userType === 'student') {
            const student = await this.studentRepository.findOne({ where: { id: userId } });
            if (student?.email) {
                email = student.email;
            }
        }
        else if (userType === 'vendor') {
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
    async createTransaction(userId, userType, createTransactionDto) {
        const wallet = await this.getOrCreateWallet(userId, userType);
        console.log({ wallet, createTransactionDto });
        if (createTransactionDto.recipientId && createTransactionDto.recipientType) {
            if (userType !== 'student' || createTransactionDto.recipientType !== 'vendor') {
                throw new common_1.BadRequestException('Only students can transfer to vendors');
            }
            const recipientWallet = await this.getOrCreateWallet(createTransactionDto.recipientId, createTransactionDto.recipientType);
            if (wallet.balance < createTransactionDto.amount) {
                throw new common_1.BadRequestException('Insufficient balance');
            }
            const senderTransaction = this.transactionRepository.create({
                ...createTransactionDto,
                walletId: wallet.id,
                type: transaction_entity_1.TransactionType.DEBIT,
                relatedUserId: recipientWallet.userId,
            });
            const recipientTransaction = this.transactionRepository.create({
                ...createTransactionDto,
                walletId: recipientWallet.id,
                type: transaction_entity_1.TransactionType.CREDIT,
                relatedUserId: wallet.userId,
            });
            wallet.balance -= createTransactionDto.amount;
            recipientWallet.balance += createTransactionDto.amount;
            await this.transactionRepository.manager.transaction(async (manager) => {
                await manager.save(senderTransaction);
                await manager.save(recipientTransaction);
                await manager.save(wallet);
                await manager.save(recipientWallet);
            });
            return senderTransaction;
        }
        if (createTransactionDto.type === transaction_entity_1.TransactionType.DEBIT && wallet.balance < createTransactionDto.amount) {
            throw new common_1.BadRequestException('Insufficient balance');
        }
        const transaction = this.transactionRepository.create({
            ...createTransactionDto,
            walletId: wallet.id,
        });
        if (createTransactionDto.type === transaction_entity_1.TransactionType.CREDIT) {
            wallet.balance += createTransactionDto.amount;
        }
        else {
            wallet.balance -= createTransactionDto.amount;
        }
        await this.transactionRepository.manager.transaction(async (manager) => {
            await manager.save(transaction);
            await manager.save(wallet);
        });
        return transaction;
    }
    async getTransactionHistory(userId, userType, page = 1, limit = 10) {
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
    async updateWalletBalance(wallet) {
        return this.walletRepository.save(wallet);
    }
    async transfer(senderId, senderType, createTransferDto) {
        if (senderType !== 'student') {
            throw new common_1.BadRequestException('Only students can make transfers');
        }
        const senderWallet = await this.getOrCreateWallet(senderId, senderType);
        const sender = await this.studentRepository.findOne({
            where: { id: senderId }
        });
        if (!sender) {
            throw new common_1.NotFoundException('Sender not found');
        }
        let recipient;
        if (createTransferDto.recipientType === create_transfer_dto_1.RecipientType.STUDENT) {
            recipient = await this.studentRepository.findOne({
                where: { username: createTransferDto.recipientUsername }
            });
        }
        else {
            recipient = await this.vendorRepository.findOne({
                where: { username: createTransferDto.recipientUsername }
            });
        }
        if (!recipient) {
            throw new common_1.NotFoundException('Recipient not found');
        }
        if (recipient.id === senderId) {
            throw new common_1.BadRequestException('Cannot transfer to yourself');
        }
        const recipientWallet = await this.getOrCreateWallet(recipient.id, createTransferDto.recipientType);
        if (senderWallet.balance < createTransferDto.amount) {
            throw new common_1.BadRequestException('Insufficient balance');
        }
        console.log('Before transfer:', {
            senderBalance: senderWallet.balance,
            recipientBalance: recipientWallet.balance,
            amount: createTransferDto.amount
        });
        const senderTransaction = this.transactionRepository.create({
            amount: createTransferDto.amount,
            type: transaction_entity_1.TransactionType.DEBIT,
            description: `Transfer to ${createTransferDto.recipientUsername}`,
            walletId: senderWallet.id,
            relatedUserId: recipient.id,
        });
        const recipientTransaction = this.transactionRepository.create({
            amount: createTransferDto.amount,
            type: transaction_entity_1.TransactionType.CREDIT,
            description: `Transfer from ${sender.username}`,
            walletId: recipientWallet.id,
            relatedUserId: senderId,
        });
        senderWallet.balance = Number(senderWallet.balance) - Number(createTransferDto.amount);
        recipientWallet.balance = Number(recipientWallet.balance) + Number(createTransferDto.amount);
        console.log('After balance update:', {
            senderBalance: senderWallet.balance,
            recipientBalance: recipientWallet.balance
        });
        const result = await this.transactionRepository.manager.transaction(async (manager) => {
            const savedSenderTransaction = await manager.save(senderTransaction);
            await manager.save(recipientTransaction);
            await manager.save(senderWallet);
            await manager.save(recipientWallet);
            return savedSenderTransaction;
        });
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
    async validateUsername(username) {
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
        return {
            fullName: '',
            userType: null,
            exists: false
        };
    }
};
exports.WalletService = WalletService;
exports.WalletService = WalletService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(wallet_entity_1.Wallet)),
    __param(1, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __param(2, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __param(3, (0, typeorm_1.InjectRepository)(vendor_entity_1.Vendor)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        student_service_1.StudentService,
        vendor_service_1.VendorService,
        auth_service_1.AuthService])
], WalletService);
//# sourceMappingURL=wallet.service.js.map