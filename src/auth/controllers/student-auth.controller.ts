import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { StudentService } from '../../modules/users/student/student.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StudentResponseDto } from '../../modules/users/dto/student-response.dto';

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
    description: 'Returns JWT token and student data on successful login',
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
              example: 'john.doe2023'
            },
            email: {
              type: 'string',
              example: 'john.doe@university.edu'
            },
            firstName: {
              type: 'string',
              example: 'John'
            },
            lastName: {
              type: 'string',
              example: 'Doe'
            },
            studentId: {
              type: 'string',
              example: 'STU2023001'
            },
            role: {
              type: 'string',
              example: 'student',
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
    description: 'Invalid credentials',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid credentials',
        error: 'Unauthorized'
      }
    }
  })
  async login(@Body() loginDto: LoginDto) {
    const student = await this.studentService.findByUsernameOrEmail(loginDto.username);
    const validatedUser = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
      student,
    );
    return this.authService.login(validatedUser, 'student');
  }
} 