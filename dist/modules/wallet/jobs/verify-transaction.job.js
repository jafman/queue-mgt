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
var VerifyTransactionJob_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyTransactionJob = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const transaction_entity_1 = require("../entities/transaction.entity");
const paystack_service_1 = require("../paystack.service");
const wallet_service_1 = require("../wallet.service");
const typeorm_3 = require("typeorm");
let VerifyTransactionJob = VerifyTransactionJob_1 = class VerifyTransactionJob {
    transactionRepository;
    paystackService;
    walletService;
    logger = new common_1.Logger(VerifyTransactionJob_1.name);
    MAX_ATTEMPTS = 20;
    POLL_INTERVAL = 30000;
    constructor(transactionRepository, paystackService, walletService) {
        this.transactionRepository = transactionRepository;
        this.paystackService = paystackService;
        this.walletService = walletService;
    }
    async handleVerification() {
        const pendingTransactions = await this.transactionRepository.find({
            where: {
                status: transaction_entity_1.TransactionStatus.PENDING,
                reference: (0, typeorm_3.Not)((0, typeorm_3.IsNull)()),
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
                console.log({ verificationData: verification.data });
                let newStatus;
                switch (status) {
                    case 'success':
                        newStatus = transaction_entity_1.TransactionStatus.SUCCESS;
                        break;
                    case 'failed':
                        newStatus = transaction_entity_1.TransactionStatus.FAILED;
                        break;
                    case 'abandoned':
                        newStatus = transaction_entity_1.TransactionStatus.ABANDONED;
                        break;
                    case 'reversed':
                        newStatus = transaction_entity_1.TransactionStatus.REVERSED;
                        break;
                    default:
                        newStatus = transaction_entity_1.TransactionStatus.PENDING;
                }
                transaction.status = newStatus;
                await this.transactionRepository.save(transaction);
                if (newStatus === transaction_entity_1.TransactionStatus.SUCCESS) {
                    const wallet = await this.walletService.getOrCreateWallet(transaction.wallet.userId, transaction.wallet.userType);
                    wallet.balance += transaction.amount;
                    await this.walletService.updateWalletBalance(wallet);
                }
                this.logger.log(`Transaction ${transaction.reference} status updated to ${newStatus}`);
            }
            catch (error) {
                this.logger.error(`Failed to verify transaction ${transaction.reference}`, error.message);
            }
        }
    }
};
exports.VerifyTransactionJob = VerifyTransactionJob;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_30_SECONDS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VerifyTransactionJob.prototype, "handleVerification", null);
exports.VerifyTransactionJob = VerifyTransactionJob = VerifyTransactionJob_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        paystack_service_1.PaystackService,
        wallet_service_1.WalletService])
], VerifyTransactionJob);
//# sourceMappingURL=verify-transaction.job.js.map