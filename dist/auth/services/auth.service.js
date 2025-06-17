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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const role_enum_1 = require("../enums/role.enum");
const vendor_service_1 = require("../../modules/users/vendor/vendor.service");
const student_service_1 = require("../../modules/users/student/student.service");
let AuthService = class AuthService {
    constructor(jwtService, studentService, vendorService) {
        this.jwtService = jwtService;
        this.studentService = studentService;
        this.vendorService = vendorService;
    }
    async validateUser(username, password, user) {
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const { password: _ } = user, result = __rest(user, ["password"]);
        return result;
    }
    async login(user, userType) {
        let role;
        if (userType === 'admin') {
            role = role_enum_1.Role.ADMIN;
        }
        else if (userType === 'student') {
            role = role_enum_1.Role.STUDENT;
        }
        else if (userType === 'vendor') {
            role = role_enum_1.Role.VENDOR;
        }
        else {
            throw new common_1.UnauthorizedException('Invalid user type');
        }
        if (userType === 'vendor' && user.firstTimeLogin) {
            return {
                message: 'Please reset your password before proceeding',
                requiresPasswordReset: true
            };
        }
        const payload = {
            username: user.username,
            sub: user.id,
            role: role
        };
        const { password } = user, userData = __rest(user, ["password"]);
        return {
            access_token: this.jwtService.sign(payload),
            user: Object.assign(Object.assign({}, userData), { role: role })
        };
    }
    async resetPassword(userType, resetPasswordDto) {
        let user;
        let service;
        switch (userType.toLowerCase()) {
            case 'student':
                service = this.studentService;
                break;
            case 'vendor':
                service = this.vendorService;
                break;
            default:
                throw new common_1.BadRequestException('Invalid user type');
        }
        user = await service.findByUsernameOrEmail(resetPasswordDto.identifier);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(resetPasswordDto.oldPassword, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);
        await service.updatePassword(user.id, hashedPassword);
        if (userType.toLowerCase() === 'vendor' && user.firstTimeLogin) {
            await this.vendorService.updateFirstTimeLogin(user.id, false);
        }
        return {
            message: 'Password reset successful'
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        student_service_1.StudentService,
        vendor_service_1.VendorService])
], AuthService);
//# sourceMappingURL=auth.service.js.map