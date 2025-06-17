import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from '../users/entities/vendor.entity';
import { Student } from '../users/entities/student.entity';
import { Transaction, TransactionType } from '../wallet/entities/transaction.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async getVendorStats() {
    // Get total number of vendors
    const allVendors = await this.vendorRepository.count();

    // Get number of pending vendors (firstTimeLogin = true)
    const pendingVendors = await this.vendorRepository.count({
      where: { firstTimeLogin: true }
    });

    // Calculate active vendors (total - pending)
    const activeVendors = allVendors - pendingVendors;

    // Inactive vendors is always 0
    const inactiveVendors = 0;

    return {
      allVendors,
      activeVendors,
      inactiveVendors,
      pendingVendors
    };
  }

  async getStudentStats() {
    // Get total number of students
    const allStudents = await this.studentRepository.count();

    // All students are considered active
    const activeStudents = allStudents;

    // Inactive students is always 0
    const inactiveStudents = 0;

    return {
      allStudents,
      activeStudents,
      inactiveStudents
    };
  }

  async getTransactionStats(page: number = 1, limit: number = 10) {
    // Get total credit amount
    const totalCreditAmount = await this.transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.type = :type', { type: TransactionType.CREDIT })
      .select('SUM(transaction.amount)', 'total')
      .getRawOne()
      .then(result => Number(result.total) || 0);

    // Get total debit amount
    const totalDebitAmount = await this.transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.type = :type', { type: TransactionType.DEBIT })
      .select('SUM(transaction.amount)', 'total')
      .getRawOne()
      .then(result => Number(result.total) || 0);

    // Get paginated transactions
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
} 