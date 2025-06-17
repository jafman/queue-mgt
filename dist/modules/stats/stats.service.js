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
exports.StatsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const vendor_entity_1 = require("../users/entities/vendor.entity");
const student_entity_1 = require("../users/entities/student.entity");
const transaction_entity_1 = require("../wallet/entities/transaction.entity");
let StatsService = class StatsService {
    vendorRepository;
    studentRepository;
    transactionRepository;
    constructor(vendorRepository, studentRepository, transactionRepository) {
        this.vendorRepository = vendorRepository;
        this.studentRepository = studentRepository;
        this.transactionRepository = transactionRepository;
    }
    async getVendorStats() {
        const allVendors = await this.vendorRepository.count();
        const pendingVendors = await this.vendorRepository.count({
            where: { firstTimeLogin: true }
        });
        const activeVendors = allVendors - pendingVendors;
        const inactiveVendors = 0;
        return {
            allVendors,
            activeVendors,
            inactiveVendors,
            pendingVendors
        };
    }
    async getStudentStats() {
        const allStudents = await this.studentRepository.count();
        const activeStudents = allStudents;
        const inactiveStudents = 0;
        return {
            allStudents,
            activeStudents,
            inactiveStudents
        };
    }
    async getTransactionStats(page = 1, limit = 10) {
        const totalCreditAmount = await this.transactionRepository
            .createQueryBuilder('transaction')
            .where('transaction.type = :type', { type: transaction_entity_1.TransactionType.CREDIT })
            .select('SUM(transaction.amount)', 'total')
            .getRawOne()
            .then(result => Number(result.total) || 0);
        const totalDebitAmount = await this.transactionRepository
            .createQueryBuilder('transaction')
            .where('transaction.type = :type', { type: transaction_entity_1.TransactionType.DEBIT })
            .select('SUM(transaction.amount)', 'total')
            .getRawOne()
            .then(result => Number(result.total) || 0);
        const [transactions, total] = await this.transactionRepository.findAndCount({
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        const totalPages = Math.ceil(total / limit);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;
        return {
            stats: {
                totalCreditAmount,
                totalDebitAmount,
                totalTransactionAmount: totalCreditAmount + totalDebitAmount
            },
            transactions,
            total,
            currentPage: page,
            totalPages,
            hasNextPage,
            hasPreviousPage
        };
    }
    async getOverview() {
        const totalTransactionsAmount = await this.transactionRepository
            .createQueryBuilder('transaction')
            .select('SUM(transaction.amount)', 'total')
            .getRawOne()
            .then(result => Number(result.total) || 0);
        const totalVendors = await this.vendorRepository.count();
        const totalStudents = await this.studentRepository.count();
        const recentActivities = await this.transactionRepository.find({
            order: { createdAt: 'DESC' },
            take: 10,
        });
        return {
            totalTransactionsAmount,
            totalVendors,
            totalStudents,
            recentActivities
        };
    }
};
exports.StatsService = StatsService;
exports.StatsService = StatsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vendor_entity_1.Vendor)),
    __param(1, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __param(2, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], StatsService);
//# sourceMappingURL=stats.service.js.map