import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../entities/student.entity';
import { CreateStudentDto } from '../dto/create-student.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { StudentListResponseDto } from '../dto/student-list.dto';
import { StudentResponseDto } from '../dto/student-response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

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

  async create(createStudentDto: CreateStudentDto): Promise<StudentResponseDto> {
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

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(createStudentDto.password, 10);
    
    const student = this.studentRepository.create({
      ...createStudentDto,
      password: hashedPassword,
    });
    
    const savedStudent = await this.studentRepository.save(student);
    return StudentResponseDto.fromEntity(savedStudent);
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