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
exports.CreateTransferDto = exports.RecipientType = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var RecipientType;
(function (RecipientType) {
    RecipientType["STUDENT"] = "student";
    RecipientType["VENDOR"] = "vendor";
})(RecipientType || (exports.RecipientType = RecipientType = {}));
class CreateTransferDto {
}
exports.CreateTransferDto = CreateTransferDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Amount to transfer',
        example: 1000.50,
        minimum: 1
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateTransferDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Username of the recipient',
        example: 'john.doe'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTransferDto.prototype, "recipientUsername", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of recipient (student or vendor)',
        enum: RecipientType,
        example: RecipientType.STUDENT
    }),
    (0, class_validator_1.IsEnum)(RecipientType),
    __metadata("design:type", String)
], CreateTransferDto.prototype, "recipientType", void 0);
//# sourceMappingURL=create-transfer.dto.js.map