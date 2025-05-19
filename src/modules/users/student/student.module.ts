import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from '../entities/student.entity';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { MailerModule } from '../../../mailer/mailer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student]),
    MailerModule,
  ],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService],
})
export class StudentModule {} 