import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from '../enums/role.enum';
import { Admin } from '../../modules/users/entities/admin.entity';
import { Student } from '../../modules/users/entities/student.entity';
import { Vendor } from '../../modules/users/entities/vendor.entity';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

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

    const payload = { 
      username: user.username, 
      sub: user.id,
      role: role
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
} 