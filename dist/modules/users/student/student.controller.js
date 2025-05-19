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
exports.StudentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const student_service_1 = require("./student.service");
const create_student_dto_1 = require("../dto/create-student.dto");
const student_response_dto_1 = require("../dto/student-response.dto");
const jwt_auth_guard_1 = require("../../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../../auth/decorators/roles.decorator");
const role_enum_1 = require("../../../auth/enums/role.enum");
const pagination_dto_1 = require("../dto/pagination.dto");
const student_list_dto_1 = require("../dto/student-list.dto");
let StudentController = class StudentController {
    studentService;
    constructor(studentService) {
        this.studentService = studentService;
    }
    async initiateRegistration(createStudentDto) {
        await this.studentService.initiateRegistration(createStudentDto);
        return { message: 'OTP sent successfully to your email' };
    }
    async verifyAndCreate(body) {
        const { otp, email, studentData } = body;
        return this.studentService.verifyAndCreate({ otp, email }, studentData);
    }
    async findAll(paginationDto) {
        return this.studentService.findAll(paginationDto);
    }
};
exports.StudentController = StudentController;
__decorate([
    (0, common_1.Post)('initiate-registration'),
    (0, swagger_1.ApiOperation)({
        summary: 'Initiate student registration',
        description: 'Starts the registration process by sending an OTP to the provided email address.'
    }),
    (0, swagger_1.ApiBody)({ type: create_student_dto_1.CreateStudentDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'OTP sent successfully',
        schema: {
            example: {
                message: 'OTP sent successfully to your email'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Conflict - Username, email, or studentId already exists'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_student_dto_1.CreateStudentDto]),
    __metadata("design:returntype", Promise)
], StudentController.prototype, "initiateRegistration", null);
__decorate([
    (0, common_1.Post)('verify-and-create'),
    (0, swagger_1.ApiOperation)({
        summary: 'Verify OTP and create student account',
        description: 'Verifies the OTP and creates the student account if verification is successful.'
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                otp: {
                    type: 'string',
                    description: '6-digit OTP sent to email',
                    example: '123456'
                },
                email: {
                    type: 'string',
                    description: 'Email address to verify',
                    example: 'student@university.edu'
                },
                studentData: {
                    type: 'object',
                    properties: {
                        username: {
                            type: 'string',
                            example: 'john.doe2023'
                        },
                        email: {
                            type: 'string',
                            example: 'john.doe@university.edu'
                        },
                        password: {
                            type: 'string',
                            example: 'SecurePass123!'
                        },
                        firstName: {
                            type: 'string',
                            example: 'John'
                        },
                        lastName: {
                            type: 'string',
                            example: 'Doe'
                        },
                        studentId: {
                            type: 'string',
                            example: 'STU2023001'
                        }
                    }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The student has been successfully created',
        type: student_response_dto_1.StudentResponseDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid or expired OTP'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StudentController.prototype, "verifyAndCreate", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiSecurity)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all students',
        description: 'Retrieves a paginated list of all students. Requires JWT authentication and admin role. Include the JWT token in the Authorization header as: Bearer <token>'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number (default: 1)',
        example: 1
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Number of items per page (default: 10)',
        example: 10
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns paginated list of students',
        type: student_list_dto_1.StudentListResponseDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing JWT token'
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Admin access required'
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], StudentController.prototype, "findAll", null);
exports.StudentController = StudentController = __decorate([
    (0, swagger_1.ApiTags)('Students'),
    (0, common_1.Controller)('students'),
    __metadata("design:paramtypes", [student_service_1.StudentService])
], StudentController);
//# sourceMappingURL=student.controller.js.map