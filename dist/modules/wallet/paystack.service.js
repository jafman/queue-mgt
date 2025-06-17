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
var PaystackService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaystackService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
let PaystackService = PaystackService_1 = class PaystackService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(PaystackService_1.name);
        this.baseUrl = 'https://api.paystack.co';
        const secretKey = this.configService.get('PAYSTACK_SECRET_KEY');
        if (!secretKey) {
            throw new Error('PAYSTACK_SECRET_KEY is not defined in environment variables');
        }
        this.secretKey = secretKey;
    }
    async initializeTransaction(email, amount) {
        var _a;
        try {
            const response = await axios_1.default.post(`${this.baseUrl}/transaction/initialize`, {
                email,
                amount: amount * 100,
            }, {
                headers: {
                    Authorization: `Bearer ${this.secretKey}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        }
        catch (error) {
            this.logger.error('Failed to initialize Paystack transaction', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            throw error;
        }
    }
    async verifyTransaction(reference) {
        var _a;
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/transaction/verify/${reference}`, {
                headers: {
                    Authorization: `Bearer ${this.secretKey}`,
                },
            });
            return response.data;
        }
        catch (error) {
            this.logger.error('Failed to verify Paystack transaction', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            throw error;
        }
    }
};
exports.PaystackService = PaystackService;
exports.PaystackService = PaystackService = PaystackService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PaystackService);
//# sourceMappingURL=paystack.service.js.map