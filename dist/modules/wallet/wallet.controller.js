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
const paystack_service_1 = require("./paystack.service");
const initialize_wallet_funding_dto_1 = require("./dto/initialize-wallet-funding.dto");
const transaction_entity_1 = require("./entities/transaction.entity");
const create_transfer_dto_1 = require("./dto/create-transfer.dto");
let WalletController = class WalletController {
    walletService;
    paystackService;
    constructor(walletService, paystackService) {
        this.walletService = walletService;
        this.paystackService = paystackService;
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
    async initializeFunding(req, initializeFundingDto) {
        const { amount, email } = initializeFundingDto;
        const paystackResponse = await this.paystackService.initializeTransaction(email, amount);
        const transaction = await this.walletService.createTransaction(req.user.id, req.user.role, {
            amount,
            type: transaction_entity_1.TransactionType.CREDIT,
            description: 'Wallet funding via Paystack',
            reference: paystackResponse.data.reference,
            status: transaction_entity_1.TransactionStatus.PENDING,
        });
        return {
            access_code: paystackResponse.data.access_code,
            reference: paystackResponse.data.reference,
            authorization_url: paystackResponse.data.authorization_url,
        };
    }
    async transfer(req, createTransferDto) {
        return this.walletService.transfer(req.user.id, req.user.role, createTransferDto);
    }
    async validateUsername(username) {
        return this.walletService.validateUsername(username);
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
                    example: 50,
                    description: 'Total number of transactions'
                },
                currentPage: {
                    type: 'number',
                    example: 1,
                    description: 'Current page number'
                },
                totalPages: {
                    type: 'number',
                    example: 5,
                    description: 'Total number of pages'
                },
                hasNextPage: {
                    type: 'boolean',
                    example: true,
                    description: 'Whether there is a next page'
                },
                hasPreviousPage: {
                    type: 'boolean',
                    example: false,
                    description: 'Whether there is a previous page'
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
__decorate([
    (0, common_1.Post)('initialize-funding'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.STUDENT),
    (0, swagger_1.ApiOperation)({ summary: 'Initialize wallet funding via Paystack' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Funding initialization successful',
        schema: {
            type: 'object',
            properties: {
                access_code: {
                    type: 'string',
                    example: 'nkdks46nymizns7',
                    description: 'Paystack access code for payment'
                },
                reference: {
                    type: 'string',
                    example: 'nms6uvr1pl',
                    description: 'Paystack transaction reference'
                },
                authorization_url: {
                    type: 'string',
                    example: 'https://checkout.paystack.com/nkdks46nymizns7',
                    description: 'URL to redirect user for payment'
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request - Invalid amount or email'
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing JWT token'
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - User does not have required role'
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, initialize_wallet_funding_dto_1.InitializeWalletFundingDto]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "initializeFunding", null);
__decorate([
    (0, common_1.Post)('transfer'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.STUDENT),
    (0, swagger_1.ApiOperation)({ summary: 'Transfer funds to another user' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Transfer successful',
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
                    enum: ['debit'],
                    example: 'debit'
                },
                description: {
                    type: 'string',
                    example: 'Transfer to john.doe'
                },
                relatedUserId: {
                    type: 'string',
                    example: '123e4567-e89b-12d3-a456-426614174000'
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
        description: 'Bad Request - Insufficient balance or invalid transfer details'
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing JWT token'
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - User does not have required role'
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Not Found - Recipient not found'
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_transfer_dto_1.CreateTransferDto]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "transfer", null);
__decorate([
    (0, common_1.Get)('validate-username/:username'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.STUDENT),
    (0, swagger_1.ApiOperation)({ summary: 'Validate username before transfer' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Username validation result',
        schema: {
            type: 'object',
            properties: {
                fullName: {
                    type: 'string',
                    example: 'John Doe',
                    description: 'User\'s full name (or business name for vendors)'
                },
                userType: {
                    type: 'string',
                    enum: ['student', 'vendor', null],
                    example: 'student',
                    description: 'Type of user (student or vendor)'
                },
                exists: {
                    type: 'boolean',
                    example: true,
                    description: 'Whether the username exists'
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
    __param(0, (0, common_1.Param)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "validateUsername", null);
exports.WalletController = WalletController = __decorate([
    (0, swagger_1.ApiTags)('Wallet'),
    (0, common_1.Controller)('wallet'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [wallet_service_1.WalletService,
        paystack_service_1.PaystackService])
], WalletController);
//# sourceMappingURL=wallet.controller.js.map