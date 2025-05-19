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
    description: 'Returns JWT token and admin data on successful login',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        },
        user: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000'
            },
            username: {
              type: 'string',
              example: 'admin1'
            },
            email: {
              type: 'string',
              example: 'admin@university.edu'
            },
            firstName: {
              type: 'string',
              example: 'Admin'
            },
            lastName: {
              type: 'string',
              example: 'User'
            },
            role: {
              type: 'string',
              example: 'admin',
              enum: ['student', 'vendor', 'admin']
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-03-19T12:00:00Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-03-19T12:00:00Z'
            }
          }
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