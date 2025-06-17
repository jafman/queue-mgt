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
    statsService;
    constructor(statsService) {
        this.statsService = statsService;
    }
    async getVendorStats() {
        return this.statsService.getVendorStats();
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
exports.StatsController = StatsController = __decorate([
    (0, swagger_1.ApiTags)('Statistics'),
    (0, common_1.Controller)('stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [stats_service_1.StatsService])
], StatsController);
//# sourceMappingURL=stats.controller.js.map