import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { Wallet } from './entities/wallet.entity';
import { Transaction } from './entities/transaction.entity';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { StudentModule } from '../users/student/student.module';
import { VendorModule } from '../users/vendor/vendor.module';
import { Student } from '../users/entities/student.entity';
import { Vendor } from '../users/entities/vendor.entity';
import { AuthModule } from '../../auth/auth.module';
import { PaystackService } from './paystack.service';
import { VerifyTransactionJob } from './jobs/verify-transaction.job';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet, Transaction, Student, Vendor]),
    ScheduleModule.forRoot(),
    StudentModule,
    VendorModule,
    AuthModule,
    QueueModule,
  ],
  controllers: [WalletController],
  providers: [WalletService, PaystackService, VerifyTransactionJob],
  exports: [WalletService],
})
export class WalletModule {} 