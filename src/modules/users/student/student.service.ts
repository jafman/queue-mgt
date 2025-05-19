import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../entities/student.entity';
import { CreateStudentDto } from '../dto/create-student.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { StudentListResponseDto } from '../dto/student-list.dto';
import { StudentResponseDto } from '../dto/student-response.dto';
import { VerifyOtpDto } from '../dto/verify-otp.dto';
import { MailerService } from '../../../mailer/mailer.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentService {
  private otpStore: Map<string, { otp: string; expiresAt: Date }> = new Map();

  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    private mailerService: MailerService,
  ) {}

  private generateOTP(): string {
    // return Math.floor(100000 + Math.random() * 900000).toString();
    return '123456';
  }

  private async sendOTPEmail(email: string, otp: string): Promise<void> {
    await this.mailerService.sendEmail({
      to: email,
      toName: 'Student',
      subject: 'Email Verification OTP',
      html: `
        <h1>Email Verification</h1>
        <p>Your OTP for email verification is: <strong>${otp}</strong></p>
        <p>This OTP will expire in 10 minutes.</p>
      `,
      text: `Your OTP for email verification is: ${otp}. This OTP will expire in 10 minutes.`,
    });
  }

  async initiateRegistration(createStudentDto: CreateStudentDto): Promise<void> {
    const existingStudent = await this.studentRepository.findOne({
      where: [
        { studentId: createStudentDto.studentId },
        { email: createStudentDto.email },
        { username: createStudentDto.username }
      ]
    });

    if (existingStudent) {
      if (existingStudent.studentId === createStudentDto.studentId) {
        throw new ConflictException('Student ID already exists');
      }
      if (existingStudent.email === createStudentDto.email) {
        throw new ConflictException('Email already exists');
      }
      if (existingStudent.username === createStudentDto.username) {
        throw new ConflictException('Username already exists');
      }
    }

    const otp = this.generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    this.otpStore.set(createStudentDto.email, { otp, expiresAt });
    await this.sendOTPEmail(createStudentDto.email, otp);
  }

  async verifyAndCreate(verifyOtpDto: VerifyOtpDto, createStudentDto: CreateStudentDto): Promise<StudentResponseDto> {
    const storedData = this.otpStore.get(verifyOtpDto.email);
    
    if (!storedData) {
      throw new BadRequestException('OTP not found. Please request a new OTP.');
    }

    if (new Date() > storedData.expiresAt) {
      this.otpStore.delete(verifyOtpDto.email);
      throw new BadRequestException('OTP has expired. Please request a new OTP.');
    }

    if (storedData.otp !== verifyOtpDto.otp) {
      throw new BadRequestException('Invalid OTP.');
    }

    // Clear the OTP after successful verification
    this.otpStore.delete(verifyOtpDto.email);

    // Hash the password and create the student
    const hashedPassword = await bcrypt.hash(createStudentDto.password, 10);
    const student = this.studentRepository.create({
      ...createStudentDto,
      password: hashedPassword,
    });
    
    const savedStudent = await this.studentRepository.save(student);
    return StudentResponseDto.fromEntity(savedStudent);
  }

  async findByStudentIdOrEmail(identifier: string): Promise<Student | null> {
    return this.studentRepository.findOne({
      where: [
        { studentId: identifier },
        { email: identifier }
      ]
    });
  }

  async findByUsernameOrEmail(identifier: string): Promise<Student | null> {
    return this.studentRepository.findOne({
      where: [
        { username: identifier },
        { email: identifier }
      ]
    });
  }

  async findAll(paginationDto: PaginationDto): Promise<StudentListResponseDto> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [students, total] = await this.studentRepository.findAndCount({
      skip,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      data: students.map(student => StudentResponseDto.fromEntity(student)),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }
} 