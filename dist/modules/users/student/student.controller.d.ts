import { StudentService } from './student.service';
import { CreateStudentDto } from '../dto/create-student.dto';
import { StudentResponseDto } from '../dto/student-response.dto';
import { VerifyOtpDto } from '../dto/verify-otp.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { StudentListResponseDto } from '../dto/student-list.dto';
export declare class StudentController {
    private readonly studentService;
    constructor(studentService: StudentService);
    initiateRegistration(createStudentDto: CreateStudentDto): Promise<{
        message: string;
    }>;
    verifyAndCreate(verifyOtpDto: VerifyOtpDto, createStudentDto: CreateStudentDto): Promise<StudentResponseDto>;
    findAll(paginationDto: PaginationDto): Promise<StudentListResponseDto>;
}
