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
exports.AdminAuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../services/auth.service");
const login_dto_1 = require("../dto/login.dto");
const admin_service_1 = require("../../modules/users/admin/admin.service");
const swagger_1 = require("@nestjs/swagger");
let AdminAuthController = class AdminAuthController {
    authService;
    adminService;
    constructor(authService, adminService) {
        this.authService = authService;
        this.adminService = adminService;
    }
    async login(loginDto) {
        const admin = await this.adminService.findByUsernameOrEmail(loginDto.username);
        const validatedUser = await this.authService.validateUser(loginDto.username, loginDto.password, admin);
        return this.authService.login(validatedUser, 'admin');
    }
};
exports.AdminAuthController = AdminAuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({
        summary: 'Admin login',
        description: 'Login as admin using either username or email address'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns JWT token and admin data on successful login',
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
                            example: 'admin1'
                        },
                        email: {
                            type: 'string',
                            example: 'admin@university.edu'
                        },
                        firstName: {
                            type: 'string',
                            example: 'Admin'
                        },
                        lastName: {
                            type: 'string',
                            example: 'User'
                        },
                        role: {
                            type: 'string',
                            example: 'admin',
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
        description: 'Invalid credentials - Username/email or password is incorrect',
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
], AdminAuthController.prototype, "login", null);
exports.AdminAuthController = AdminAuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('auth/admin'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        admin_service_1.AdminService])
], AdminAuthController);
//# sourceMappingURL=admin-auth.controller.js.map