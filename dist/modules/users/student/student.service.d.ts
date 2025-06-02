import { Repository } from 'typeorm';
import { Student } from '../entities/student.entity';
import { CreateStudentDto } from '../dto/create-student.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { StudentListResponseDto } from '../dto/student-list.dto';
import { StudentResponseDto } from '../dto/student-response.dto';
import { VerifyOtpDto } from '../dto/verify-otp.dto';
import { MailerService } from '../../../mailer/mailer.service';
export declare class StudentService {
    private studentRepository;
    private mailerService;
    private otpStore;
    constructor(studentRepository: Repository<Student>, mailerService: MailerService);
    private generateOTP;
    private sendOTPEmail;
    initiateRegistration(createStudentDto: CreateStudentDto): Promise<void>;
    verifyAndCreate(verifyOtpDto: VerifyOtpDto, createStudentDto: CreateStudentDto): Promise<StudentResponseDto>;
    findByStudentIdOrEmail(identifier: string): Promise<Student | null>;
    findByUsernameOrEmail(identifier: string): Promise<Student | null>;
    findAll(paginationDto: PaginationDto): Promise<StudentListResponseDto>;
    updatePassword(id: string, hashedPassword: string): Promise<void>;
}
