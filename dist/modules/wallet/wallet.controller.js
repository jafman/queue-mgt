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
exports.WalletController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const wallet_service_1 = require("./wallet.service");
const create_transaction_dto_1 = require("./dto/create-transaction.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const role_enum_1 = require("../../auth/enums/role.enum");
let WalletController = class WalletController {
    walletService;
    constructor(walletService) {
        this.walletService = walletService;
    }
    async getBalance(req) {
        return this.walletService.getWalletBalance(req.user.id, req.user.role);
    }
    async createTransaction(req, createTransactionDto) {
        return this.walletService.createTransaction(req.user.id, req.user.role, createTransactionDto);
    }
    async getTransactionHistory(req, page = 1, limit = 10) {
        return this.walletService.getTransactionHistory(req.user.id, req.user.role, page, limit);
    }
};
exports.WalletController = WalletController;
__decorate([
    (0, common_1.Get)('balance'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.STUDENT, role_enum_1.Role.VENDOR),
    (0, swagger_1.ApiOperation)({ summary: 'Get wallet balance' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns the current wallet balance and user email',
        schema: {
            type: 'object',
            properties: {
                balance: {
                    type: 'number',
                    example: 1000.50
                },
                email: {
                    type: 'string',
                    example: 'user@example.com'
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing JWT token'
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - User does not have required role'
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "getBalance", null);
__decorate([
    (0, common_1.Post)('transactions'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.STUDENT, role_enum_1.Role.VENDOR),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new transaction' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Transaction created successfully',
        schema: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    example: '123e4567-e89b-12d3-a456-426614174000'
                },
                amount: {
                    type: 'number',
                    example: 100.50
                },
                type: {
                    type: 'string',
                    enum: ['credit', 'debit'],
                    example: 'credit'
                },
                description: {
                    type: 'string',
                    example: 'Payment for lunch'
                },
                reference: {
                    type: 'string',
                    example: 'TRX123456'
                },
                relatedUserId: {
                    type: 'string',
                    example: '123e4567-e89b-12d3-a456-426614174000',
                    nullable: true
                },
                createdAt: {
                    type: 'string',
                    format: 'date-time',
                    example: '2024-03-19T12:00:00Z'
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request - Insufficient balance for debit transaction'
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing JWT token'
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - User does not have required role'
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_transaction_dto_1.CreateTransactionDto]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "createTransaction", null);
__decorate([
    (0, common_1.Get)('transactions'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.STUDENT, role_enum_1.Role.VENDOR),
    (0, swagger_1.ApiOperation)({ summary: 'Get transaction history' }),
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
        description: 'Returns paginated transaction history',
        schema: {
            type: 'object',
            properties: {
                transactions: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'string',
                                example: '123e4567-e89b-12d3-a456-426614174000'
                            },
                            amount: {
                                type: 'number',
                                example: 100.50
                            },
                            type: {
                                type: 'string',
                                enum: ['credit', 'debit'],
                                example: 'credit'
                            },
                            description: {
                                type: 'string',
                                example: 'Payment for lunch'
                            },
                            reference: {
                                type: 'string',
                                example: 'TRX123456'
                            },
                            relatedUserId: {
                                type: 'string',
                                example: '123e4567-e89b-12d3-a456-426614174000',
                                nullable: true
                            },
                            createdAt: {
                                type: 'string',
                                format: 'date-time',
                                example: '2024-03-19T12:00:00Z'
                            }
                        }
                    }
                },
                total: {
                    type: 'number',
                    example: 50
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing JWT token'
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - User does not have required role'
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "getTransactionHistory", null);
exports.WalletController = WalletController = __decorate([
    (0, swagger_1.ApiTags)('Wallet'),
    (0, common_1.Controller)('wallet'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [wallet_service_1.WalletService])
], WalletController);
//# sourceMappingURL=wallet.controller.js.map