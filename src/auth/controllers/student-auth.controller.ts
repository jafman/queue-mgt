import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { StudentService } from '../../modules/users/student/student.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth/student')
export class StudentAuthController {
  constructor(
    private authService: AuthService,
    private studentService: StudentService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Student login with username or email' })
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
    const student = await this.studentService.findByUsernameOrEmail(loginDto.username);
    const validatedUser = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
      student,
    );
    return this.authService.login(validatedUser);
  }
} 