import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Queue } from './entities/queue.entity';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { Student } from '../users/entities/student.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Queue, Student]),
  ],
  providers: [QueueService],
  controllers: [QueueController],
  exports: [QueueService]
})
export class QueueModule {} 