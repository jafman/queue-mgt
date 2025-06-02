import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from '../enums/role.enum';
import { Admin } from '../../modules/users/entities/admin.entity';
import { Student } from '../../modules/users/entities/student.entity';
import { Vendor } from '../../modules/users/entities/vendor.entity';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { VendorService } from '../../modules/users/vendor/vendor.service';
import { StudentService } from '../../modules/users/student/student.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private studentService: StudentService,
    private vendorService: VendorService,
  ) {}

  async validateUser(username: string, password: string, user: any): Promise<any> {
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any, userType: string) {
    // Determine the role based on the user type
    let role: Role;
    if (userType === 'admin') {
      role = Role.ADMIN;
    } else if (userType === 'student') {
      role = Role.STUDENT;
    } else if (userType === 'vendor') {
      role = Role.VENDOR;
    } else {
      throw new UnauthorizedException('Invalid user type');
    }

    // Special handling for first-time vendor login
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

    // Remove sensitive data from user object
    const { password, ...userData } = user;

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        ...userData,
        role: role
      }
    };
  }

  async resetPassword(userType: string, resetPasswordDto: ResetPasswordDto) {
    let user: any;
    let service: StudentService | VendorService;

    // Determine which service to use based on user type
    switch (userType.toLowerCase()) {
      case 'student':
        service = this.studentService;
        break;
      case 'vendor':
        service = this.vendorService;
        break;
      default:
        throw new BadRequestException('Invalid user type');
    }

    // Find user by username or email
    user = await service.findByUsernameOrEmail(resetPasswordDto.identifier);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify old password
    const isPasswordValid = await bcrypt.compare(resetPasswordDto.oldPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);

    // Update password
    await service.updatePassword(user.id, hashedPassword);

    // If it's a vendor's first login, update firstTimeLogin flag
    if (userType.toLowerCase() === 'vendor' && user.firstTimeLogin) {
      await this.vendorService.updateFirstTimeLogin(user.id, false);
    }

    return {
      message: 'Password reset successful'
    };
  }
} 