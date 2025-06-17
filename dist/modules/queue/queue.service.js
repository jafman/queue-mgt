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
exports.QueueService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const queue_entity_1 = require("./entities/queue.entity");
const student_entity_1 = require("../users/entities/student.entity");
let QueueService = class QueueService {
    constructor(queueRepository, studentRepository) {
        this.queueRepository = queueRepository;
        this.studentRepository = studentRepository;
    }
    async addToQueue(vendorId, studentId, transactionId) {
        const existingQueue = await this.queueRepository.findOne({
            where: { studentId }
        });
        if (existingQueue) {
            return existingQueue;
        }
        const lastQueue = await this.queueRepository.findOne({
            where: { vendorId },
            order: { position: 'DESC' }
        });
        const position = lastQueue ? lastQueue.position + 1 : 1;
        const queue = this.queueRepository.create({
            vendorId,
            studentId,
            transactionId,
            position,
            status: queue_entity_1.QueueStatus.PENDING
        });
        return this.queueRepository.save(queue);
    }
    async getQueuePosition(studentId) {
        const queue = await this.queueRepository.findOne({
            where: { studentId }
        });
        if (!queue) {
            throw new common_1.NotFoundException('Student is not in any queue');
        }
        return queue.position;
    }
    async getVendorQueue(vendorId) {
        return this.queueRepository.find({
            where: { vendorId },
            order: { position: 'ASC' },
            relations: {
                student: true
            },
            select: {
                id: true,
                vendorId: true,
                studentId: true,
                transactionId: true,
                status: true,
                position: true,
                createdAt: true,
                servedAt: true,
                student: {
                    id: true,
                    username: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    studentId: true,
                    createdAt: true,
                    updatedAt: true
                }
            }
        });
    }
    async completeCurrent(vendorId) {
        const currentServing = await this.queueRepository.findOne({
            where: {
                vendorId,
                status: queue_entity_1.QueueStatus.SERVING
            }
        });
        if (!currentServing) {
            throw new common_1.NotFoundException('No student is currently being served');
        }
        currentServing.status = queue_entity_1.QueueStatus.COMPLETED;
        currentServing.servedAt = new Date();
        await this.queueRepository.save(currentServing);
        const nextInLine = await this.queueRepository.findOne({
            where: {
                vendorId,
                status: queue_entity_1.QueueStatus.PENDING
            },
            order: { position: 'ASC' }
        });
        if (nextInLine) {
            nextInLine.status = queue_entity_1.QueueStatus.SERVING;
            nextInLine.servedAt = new Date();
            await this.queueRepository.save(nextInLine);
        }
        return currentServing;
    }
    async getCurrentServing(vendorId) {
        return this.queueRepository.findOne({
            where: {
                vendorId,
                status: queue_entity_1.QueueStatus.SERVING
            },
            relations: ['student']
        });
    }
    async completeStudent(vendorId, studentEmail) {
        const student = await this.studentRepository.findOne({
            where: { email: studentEmail }
        });
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        const queueEntry = await this.queueRepository.findOne({
            where: {
                vendorId,
                studentId: student.id,
                status: queue_entity_1.QueueStatus.PENDING
            }
        });
        if (!queueEntry) {
            throw new common_1.NotFoundException('Student is not in your queue');
        }
        await this.queueRepository.remove(queueEntry);
        const nextInLine = await this.queueRepository.findOne({
            where: {
                vendorId,
                status: queue_entity_1.QueueStatus.PENDING
            },
            order: { position: 'ASC' }
        });
        if (nextInLine) {
            nextInLine.status = queue_entity_1.QueueStatus.SERVING;
            nextInLine.servedAt = new Date();
            await this.queueRepository.save(nextInLine);
        }
        return queueEntry;
    }
};
exports.QueueService = QueueService;
exports.QueueService = QueueService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(queue_entity_1.Queue)),
    __param(1, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], QueueService);
//# sourceMappingURL=queue.service.js.map