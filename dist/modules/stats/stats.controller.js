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
exports.StatsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const role_enum_1 = require("../../auth/enums/role.enum");
const stats_service_1 = require("./stats.service");
let StatsController = class StatsController {
    constructor(statsService) {
        this.statsService = statsService;
    }
    async getVendorStats() {
        return this.statsService.getVendorStats();
    }
    async getStudentStats() {
        return this.statsService.getStudentStats();
    }
    async getTransactionStats(page = 1, limit = 10) {
        return this.statsService.getTransactionStats(page, limit);
    }
    async getOverview() {
        return this.statsService.getOverview();
    }
};
exports.StatsController = StatsController;
__decorate([
    (0, common_1.Get)('vendor'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get vendor statistics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns vendor statistics',
        schema: {
            type: 'object',
            properties: {
                allVendors: {
                    type: 'number',
                    example: 100,
                    description: 'Total number of vendors'
                },
                activeVendors: {
                    type: 'number',
                    example: 80,
                    description: 'Number of active vendors'
                },
                inactiveVendors: {
                    type: 'number',
                    example: 0,
                    description: 'Number of inactive vendors (always 0)'
                },
                pendingVendors: {
                    type: 'number',
                    example: 20,
                    description: 'Number of vendors who haven\'t logged in for the first time'
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatsController.prototype, "getVendorStats", null);
__decorate([
    (0, common_1.Get)('student'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get student statistics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns student statistics',
        schema: {
            type: 'object',
            properties: {
                allStudents: {
                    type: 'number',
                    example: 500,
                    description: 'Total number of students'
                },
                activeStudents: {
                    type: 'number',
                    example: 500,
                    description: 'Number of active students'
                },
                inactiveStudents: {
                    type: 'number',
                    example: 0,
                    description: 'Number of inactive students (always 0)'
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatsController.prototype, "getStudentStats", null);
__decorate([
    (0, common_1.Get)('transactions'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get transaction statistics' }),
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
        description: 'Returns transaction statistics and paginated transactions',
        schema: {
            type: 'object',
            properties: {
                stats: {
                    type: 'object',
                    properties: {
                        totalCreditAmount: {
                            type: 'number',
                            example: 50000.50,
                            description: 'Total amount of credit transactions'
                        },
                        totalDebitAmount: {
                            type: 'number',
                            example: 30000.25,
                            description: 'Total amount of debit transactions'
                        },
                        totalTransactionAmount: {
                            type: 'number',
                            example: 80000.75,
                            description: 'Total amount of all transactions'
                        }
                    }
                },
                transactions: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                            amount: { type: 'number', example: 100.50 },
                            type: { type: 'string', enum: ['credit', 'debit'] },
                            description: { type: 'string' },
                            status: { type: 'string', enum: ['success', 'pending', 'failed'] },
                            createdAt: { type: 'string', format: 'date-time' }
                        }
                    }
                },
                total: { type: 'number', example: 50 },
                currentPage: { type: 'number', example: 1 },
                totalPages: { type: 'number', example: 5 },
                hasNextPage: { type: 'boolean', example: true },
                hasPreviousPage: { type: 'boolean', example: false }
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
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], StatsController.prototype, "getTransactionStats", null);
__decorate([
    (0, common_1.Get)('overview'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get system overview statistics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns system overview statistics',
        schema: {
            type: 'object',
            properties: {
                totalTransactionsAmount: {
                    type: 'number',
                    example: 80000.75,
                    description: 'Total amount of all transactions'
                },
                totalVendors: {
                    type: 'number',
                    example: 100,
                    description: 'Total number of vendors'
                },
                totalStudents: {
                    type: 'number',
                    example: 500,
                    description: 'Total number of students'
                },
                recentActivities: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                            amount: { type: 'number', example: 100.50 },
                            type: { type: 'string', enum: ['credit', 'debit'] },
                            description: { type: 'string' },
                            status: { type: 'string', enum: ['success', 'pending', 'failed'] },
                            createdAt: { type: 'string', format: 'date-time' }
                        }
                    },
                    description: 'Last 10 transactions'
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatsController.prototype, "getOverview", null);
exports.StatsController = StatsController = __decorate([
    (0, swagger_1.ApiTags)('Statistics'),
    (0, common_1.Controller)('stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [stats_service_1.StatsService])
], StatsController);
//# sourceMappingURL=stats.controller.js.map