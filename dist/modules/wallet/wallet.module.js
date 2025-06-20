"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const schedule_1 = require("@nestjs/schedule");
const wallet_entity_1 = require("./entities/wallet.entity");
const transaction_entity_1 = require("./entities/transaction.entity");
const wallet_service_1 = require("./wallet.service");
const wallet_controller_1 = require("./wallet.controller");
const student_module_1 = require("../users/student/student.module");
const vendor_module_1 = require("../users/vendor/vendor.module");
const student_entity_1 = require("../users/entities/student.entity");
const vendor_entity_1 = require("../users/entities/vendor.entity");
const auth_module_1 = require("../../auth/auth.module");
const paystack_service_1 = require("./paystack.service");
const verify_transaction_job_1 = require("./jobs/verify-transaction.job");
const queue_module_1 = require("../queue/queue.module");
let WalletModule = class WalletModule {
};
exports.WalletModule = WalletModule;
exports.WalletModule = WalletModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([wallet_entity_1.Wallet, transaction_entity_1.Transaction, student_entity_1.Student, vendor_entity_1.Vendor]),
            schedule_1.ScheduleModule.forRoot(),
            student_module_1.StudentModule,
            vendor_module_1.VendorModule,
            auth_module_1.AuthModule,
            queue_module_1.QueueModule,
        ],
        controllers: [wallet_controller_1.WalletController],
        providers: [wallet_service_1.WalletService, paystack_service_1.PaystackService, verify_transaction_job_1.VerifyTransactionJob],
        exports: [wallet_service_1.WalletService],
    })
], WalletModule);
//# sourceMappingURL=wallet.module.js.map