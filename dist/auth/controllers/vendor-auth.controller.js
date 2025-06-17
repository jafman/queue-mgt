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
exports.VendorAuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../services/auth.service");
const login_dto_1 = require("../dto/login.dto");
const vendor_service_1 = require("../../modules/users/vendor/vendor.service");
const swagger_1 = require("@nestjs/swagger");
let VendorAuthController = class VendorAuthController {
    constructor(authService, vendorService) {
        this.authService = authService;
        this.vendorService = vendorService;
    }
    async login(loginDto) {
        const vendor = await this.vendorService.findByUsername(loginDto.username);
        const validatedUser = await this.authService.validateUser(loginDto.username, loginDto.password, vendor);
        return this.authService.login(validatedUser, 'vendor');
    }
};
exports.VendorAuthController = VendorAuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Vendor login' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns JWT token and vendor data on successful login',
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
                            example: 'cafeteria1'
                        },
                        email: {
                            type: 'string',
                            example: 'cafeteria1@university.edu'
                        },
                        businessName: {
                            type: 'string',
                            example: 'University Cafeteria'
                        },
                        role: {
                            type: 'string',
                            example: 'vendor',
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
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid credentials' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], VendorAuthController.prototype, "login", null);
exports.VendorAuthController = VendorAuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('auth/vendor'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        vendor_service_1.VendorService])
], VendorAuthController);
//# sourceMappingURL=vendor-auth.controller.js.map