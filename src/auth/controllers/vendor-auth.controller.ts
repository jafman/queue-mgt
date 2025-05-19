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
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    const vendor = await this.vendorService.findByUsername(loginDto.username);
    const validatedUser = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
      vendor,
    );
    return this.authService.login(validatedUser, 'vendor');
  }
} 