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
exports.StudentAuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../services/auth.service");
const login_dto_1 = require("../dto/login.dto");
const student_service_1 = require("../../modules/users/student/student.service");
const swagger_1 = require("@nestjs/swagger");
let StudentAuthController = class StudentAuthController {
    constructor(authService, studentService) {
        this.authService = authService;
        this.studentService = studentService;
    }
    async login(loginDto) {
        const student = await this.studentService.findByUsernameOrEmail(loginDto.username);
        const validatedUser = await this.authService.validateUser(loginDto.username, loginDto.password, student);
        return this.authService.login(validatedUser, 'student');
    }
};
exports.StudentAuthController = StudentAuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Student login with username or email' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns JWT token and student data on successful login',
        schema: {
            type: 'object',
            properties: {
                access_token: {
                    type: 'string',
                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                },
                user: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            example: '123e4567-e89b-12d3-a456-426614174000'
                        },
                        username: {
                            type: 'string',
                            example: 'john.doe2023'
                        },
                        email: {
                            type: 'string',
                            example: 'john.doe@university.edu'
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
                        },
                        role: {
                            type: 'string',
                            example: 'student',
                            enum: ['student', 'vendor', 'admin']
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-03-19T12:00:00Z'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-03-19T12:00:00Z'
                        }
                    }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Invalid credentials',
        schema: {
            example: {
                statusCode: 401,
                message: 'Invalid credentials',
                error: 'Unauthorized'
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], StudentAuthController.prototype, "login", null);
exports.StudentAuthController = StudentAuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('auth/student'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        student_service_1.StudentService])
], StudentAuthController);
//# sourceMappingURL=student-auth.controller.js.map