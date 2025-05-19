import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { AdminService } from '../../modules/users/admin/admin.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth/admin')
export class AdminAuthController {
  constructor(
    private authService: AuthService,
    private adminService: AdminService,
  ) {}

  @Post('login')
  @ApiOperation({ 
    summary: 'Admin login',
    description: 'Login as admin using either username or email address'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns JWT token on successful login',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Invalid credentials - Username/email or password is incorrect',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid credentials',
        error: 'Unauthorized'
      }
    }
  })
  async login(@Body() loginDto: LoginDto) {
    const admin = await this.adminService.findByUsernameOrEmail(loginDto.username);
    const validatedUser = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
      admin,
    );
    return this.authService.login(validatedUser, 'admin');
  }
} 