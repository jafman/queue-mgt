import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { Vendor } from '../users/entities/vendor.entity';
import { Student } from '../users/entities/student.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vendor, Student]),
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {} 