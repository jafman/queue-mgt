import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { Vendor } from '../users/entities/vendor.entity';
import { Student } from '../users/entities/student.entity';
import { Transaction } from '../wallet/entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vendor, Student, Transaction]),
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {} 