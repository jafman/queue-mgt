import { Repository } from 'typeorm';
import { Student } from '../entities/student.entity';
import { CreateStudentDto } from '../dto/create-student.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { StudentListResponseDto } from '../dto/student-list.dto';
import { StudentResponseDto } from '../dto/student-response.dto';
export declare class StudentService {
    private studentRepository;
    constructor(studentRepository: Repository<Student>);
    findByStudentIdOrEmail(identifier: string): Promise<Student | null>;
    findByUsernameOrEmail(identifier: string): Promise<Student | null>;
    create(createStudentDto: CreateStudentDto): Promise<StudentResponseDto>;
    findAll(paginationDto: PaginationDto): Promise<StudentListResponseDto>;
}
