import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { Vendor } from '../users/entities/vendor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vendor]),
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {} 