import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { Transaction } from './entities/transaction.entity';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { StudentModule } from '../users/student/student.module';
import { VendorModule } from '../users/vendor/vendor.module';
import { Student } from '../users/entities/student.entity';
import { Vendor } from '../users/entities/vendor.entity';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet, Transaction, Student, Vendor]),
    StudentModule,
    VendorModule,
    AuthModule,
  ],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {} 