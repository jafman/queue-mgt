"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const student_entity_1 = require("../entities/student.entity");
const student_response_dto_1 = require("../dto/student-response.dto");
const mailer_service_1 = require("../../../mailer/mailer.service");
const bcrypt = require("bcrypt");
let StudentService = class StudentService {
    studentRepository;
    mailerService;
    otpStore = new Map();
    constructor(studentRepository, mailerService) {
        this.studentRepository = studentRepository;
        this.mailerService = mailerService;
    }
    generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    async sendOTPEmail(email, otp) {
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
    async initiateRegistration(createStudentDto) {
        const existingStudent = await this.studentRepository.findOne({
            where: [
                { studentId: createStudentDto.studentId },
                { email: createStudentDto.email },
                { username: createStudentDto.username }
            ]
        });
        if (existingStudent) {
            if (existingStudent.studentId === createStudentDto.studentId) {
                throw new common_1.ConflictException('Student ID already exists');
            }
            if (existingStudent.email === createStudentDto.email) {
                throw new common_1.ConflictException('Email already exists');
            }
            if (existingStudent.username === createStudentDto.username) {
                throw new common_1.ConflictException('Username already exists');
            }
        }
        const otp = this.generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        this.otpStore.set(createStudentDto.email, { otp, expiresAt });
        await this.sendOTPEmail(createStudentDto.email, otp);
    }
    async verifyAndCreate(verifyOtpDto, createStudentDto) {
        const storedData = this.otpStore.get(verifyOtpDto.email);
        if (!storedData) {
            throw new common_1.BadRequestException('OTP not found. Please request a new OTP.');
        }
        if (new Date() > storedData.expiresAt) {
            this.otpStore.delete(verifyOtpDto.email);
            throw new common_1.BadRequestException('OTP has expired. Please request a new OTP.');
        }
        if (storedData.otp !== verifyOtpDto.otp) {
            throw new common_1.BadRequestException('Invalid OTP.');
        }
        this.otpStore.delete(verifyOtpDto.email);
        const hashedPassword = await bcrypt.hash(createStudentDto.password, 10);
        const student = this.studentRepository.create({
            ...createStudentDto,
            password: hashedPassword,
        });
        const savedStudent = await this.studentRepository.save(student);
        return student_response_dto_1.StudentResponseDto.fromEntity(savedStudent);
    }
    async findByStudentIdOrEmail(identifier) {
        return this.studentRepository.findOne({
            where: [
                { studentId: identifier },
                { email: identifier }
            ]
        });
    }
    async findByUsernameOrEmail(identifier) {
        return this.studentRepository.findOne({
            where: [
                { username: identifier },
                { email: identifier }
            ]
        });
    }
    async findAll(paginationDto) {
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
            data: students.map(student => student_response_dto_1.StudentResponseDto.fromEntity(student)),
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        };
    }
};
exports.StudentService = StudentService;
exports.StudentService = StudentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        mailer_service_1.MailerService])
], StudentService);
//# sourceMappingURL=student.service.js.map