import { Controller, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { AuthService } from '../services/auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(':userType/reset-password')
  @ApiOperation({ summary: 'Reset user password' })
  @ApiParam({
    name: 'userType',
    enum: ['student', 'vendor'],
    description: 'Type of user (student or vendor)'
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset successful',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Password reset successful'
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid user type or password format'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid credentials'
  })
  async resetPassword(
    @Param('userType') userType: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(userType, resetPasswordDto);
  }
} 