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
exports.QueueController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const role_enum_1 = require("../../auth/enums/role.enum");
const queue_service_1 = require("./queue.service");
const queue_entity_1 = require("./entities/queue.entity");
const complete_queue_dto_1 = require("./dto/complete-queue.dto");
let QueueController = class QueueController {
    constructor(queueService) {
        this.queueService = queueService;
    }
    async getVendorQueue(req) {
        return this.queueService.getVendorQueue(req.user.id);
    }
    async completeStudent(req, completeQueueDto) {
        return this.queueService.completeStudent(req.user.id, completeQueueDto.studentEmail);
    }
};
exports.QueueController = QueueController;
__decorate([
    (0, common_1.Get)('vendor'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.VENDOR),
    (0, swagger_1.ApiOperation)({ summary: 'Get vendor\'s queue' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns list of students in vendor\'s queue',
        type: [queue_entity_1.Queue]
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QueueController.prototype, "getVendorQueue", null);
__decorate([
    (0, common_1.Post)('complete'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.VENDOR),
    (0, swagger_1.ApiOperation)({ summary: 'Complete a student\'s queue entry and serve next in line' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns the completed queue entry',
        type: queue_entity_1.Queue
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found or not in queue'
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, complete_queue_dto_1.CompleteQueueDto]),
    __metadata("design:returntype", Promise)
], QueueController.prototype, "completeStudent", null);
exports.QueueController = QueueController = __decorate([
    (0, swagger_1.ApiTags)('Queue'),
    (0, common_1.Controller)('queue'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [queue_service_1.QueueService])
], QueueController);
//# sourceMappingURL=queue.controller.js.map