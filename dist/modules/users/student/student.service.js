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
const bcrypt = require("bcrypt");
let StudentService = class StudentService {
    studentRepository;
    constructor(studentRepository) {
        this.studentRepository = studentRepository;
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
    async create(createStudentDto) {
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
        const hashedPassword = await bcrypt.hash(createStudentDto.password, 10);
        const student = this.studentRepository.create({
            ...createStudentDto,
            password: hashedPassword,
        });
        const savedStudent = await this.studentRepository.save(student);
        return student_response_dto_1.StudentResponseDto.fromEntity(savedStudent);
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
    __metadata("design:paramtypes", [typeorm_2.Repository])
], StudentService);
//# sourceMappingURL=student.service.js.map