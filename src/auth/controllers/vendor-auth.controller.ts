import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { VendorService } from '../../modules/users/vendor/vendor.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth/vendor')
export class VendorAuthController {
  constructor(
    private authService: AuthService,
    private vendorService: VendorService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Vendor login' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns JWT token and vendor data on successful login',
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
              example: 'cafeteria1'
            },
            email: {
              type: 'string',
              example: 'cafeteria1@university.edu'
            },
            businessName: {
              type: 'string',
              example: 'University Cafeteria'
            },
            role: {
              type: 'string',
              example: 'vendor',
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
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    const vendor = await this.vendorService.findByUsernameOrEmail(loginDto.username);
    const validatedUser = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
      vendor,
    );
    return this.authService.login(validatedUser, 'vendor');
  }
} 