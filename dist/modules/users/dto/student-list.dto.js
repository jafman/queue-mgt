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
exports.StudentListResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const student_response_dto_1 = require("./student-response.dto");
class StudentListResponseDto {
}
exports.StudentListResponseDto = StudentListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of students',
        type: [student_response_dto_1.StudentResponseDto],
        example: [
            {
                id: 'uuid',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                phoneNumber: '+1234567890',
                department: 'Computer Science',
                level: '400',
                studentId: 'STU2023001',
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z'
            }
        ]
    }),
    __metadata("design:type", Array)
], StudentListResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current page number',
        example: 1
    }),
    __metadata("design:type", Number)
], StudentListResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of items per page',
        example: 10
    }),
    __metadata("design:type", Number)
], StudentListResponseDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of items',
        example: 100
    }),
    __metadata("design:type", Number)
], StudentListResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of pages',
        example: 10
    }),
    __metadata("design:type", Number)
], StudentListResponseDto.prototype, "totalPages", void 0);
//# sourceMappingURL=student-list.dto.js.map