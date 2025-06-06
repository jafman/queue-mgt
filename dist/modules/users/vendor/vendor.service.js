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
exports.VendorService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const vendor_entity_1 = require("../entities/vendor.entity");
const mailer_service_1 = require("../../../mailer/mailer.service");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
let VendorService = class VendorService {
    vendorRepository;
    mailerService;
    constructor(vendorRepository, mailerService) {
        this.vendorRepository = vendorRepository;
        this.mailerService = mailerService;
    }
    generatePassword() {
        return crypto.randomBytes(4).toString('hex').toUpperCase();
    }
    async hashPassword(password) {
        const salt = await bcrypt.genSalt();
        return bcrypt.hash(password, salt);
    }
    async findByUsername(username) {
        return this.vendorRepository.findOne({ where: { username } });
    }
    async findByUsernameOrEmail(identifier) {
        return this.vendorRepository.findOne({
            where: [
                { username: identifier },
                { email: identifier }
            ]
        });
    }
    async create(createVendorDto) {
        const existingVendor = await this.vendorRepository.findOne({
            where: [
                { username: createVendorDto.username },
                { email: createVendorDto.email },
                { phone: createVendorDto.phone }
            ]
        });
        if (existingVendor) {
            if (existingVendor.username === createVendorDto.username) {
                throw new common_1.ConflictException('Username already exists');
            }
            if (existingVendor.email === createVendorDto.email) {
                throw new common_1.ConflictException('Email already exists');
            }
            if (existingVendor.phone === createVendorDto.phone) {
                throw new common_1.ConflictException('Phone number already exists');
            }
        }
        const plainPassword = 'PASSWORD';
        const vendor = this.vendorRepository.create({
            ...createVendorDto,
            password: await this.hashPassword(plainPassword),
            firstTimeLogin: true
        });
        const savedVendor = await this.vendorRepository.save(vendor);
        await this.mailerService.sendEmail({
            to: savedVendor.email,
            toName: savedVendor.name,
            subject: 'VENDOR INVITATION',
            html: `
        <p>Hi, ${savedVendor.name}</p>
        <p>You have been invited to join QUICKP as a vendor. Your Account has been created and added to the platform.</p>
        <p>Login to the app <a href="https://www.quickp.com.ng/">https://www.quickp.com.ng/</a> using the following password: <strong>${plainPassword}</strong></p>
      `,
            text: `Hi, ${savedVendor.name}. You have been invited to join QUICKP as a vendor. Your Account has been created and added to the platform. Login to the app https://www.quickp.com.ng/ using the following password: ${plainPassword}`
        });
        const { password: _, ...vendorWithoutPassword } = savedVendor;
        return vendorWithoutPassword;
    }
    async updatePassword(id, hashedPassword) {
        await this.vendorRepository.update(id, { password: hashedPassword });
    }
    async updateFirstTimeLogin(id, value) {
        await this.vendorRepository.update(id, { firstTimeLogin: value });
    }
    async findAll(page = 1, limit = 10) {
        const [vendors, total] = await this.vendorRepository.findAndCount({
            select: {
                id: true,
                username: true,
                name: true,
                email: true,
                phone: true,
                business_name: true,
                business_category: true,
                firstTimeLogin: true,
                createdAt: true,
                updatedAt: true
            },
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        const totalPages = Math.ceil(total / limit);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;
        return {
            vendors,
            total,
            currentPage: page,
            totalPages,
            hasNextPage,
            hasPreviousPage
        };
    }
};
exports.VendorService = VendorService;
exports.VendorService = VendorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vendor_entity_1.Vendor)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        mailer_service_1.MailerService])
], VendorService);
//# sourceMappingURL=vendor.service.js.map