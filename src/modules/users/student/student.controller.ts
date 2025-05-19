import { Controller, Post, Body, Get, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiQuery, ApiSecurity } from '@nestjs/swagger';
import { StudentService } from './student.service';
import { CreateStudentDto } from '../dto/create-student.dto';
import { StudentResponseDto } from '../dto/student-response.dto';
import { VerifyOtpDto } from '../dto/verify-otp.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { Role } from '../../../auth/enums/role.enum';
import { PaginationDto } from '../dto/pagination.dto';
import { StudentListResponseDto } from '../dto/student-list.dto';

@ApiTags('Students')
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post('initiate-registration')
  @ApiOperation({ 
    summary: 'Initiate student registration',
    description: 'Starts the registration process by sending an OTP to the provided email address.'
  })
  @ApiBody({ type: CreateStudentDto })
  @ApiResponse({ 
    status: 200, 
    description: 'OTP sent successfully',
    schema: {
      example: {
        message: 'OTP sent successfully to your email'
      }
    }
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Conflict - Username, email, or studentId already exists'
  })
  async initiateRegistration(@Body() createStudentDto: CreateStudentDto): Promise<{ message: string }> {
    await this.studentService.initiateRegistration(createStudentDto);
    return { message: 'OTP sent successfully to your email' };
  }

  @Post('verify-and-create')
  @ApiOperation({ 
    summary: 'Verify OTP and create student account',
    description: 'Verifies the OTP and creates the student account if verification is successful.'
  })
  @ApiBody({ 
    type: VerifyOtpDto,
    description: 'OTP verification information'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'The student has been successfully created',
    type: StudentResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid or expired OTP'
  })
  async verifyAndCreate(
    @Body() verifyOtpDto: VerifyOtpDto,
    @Body() createStudentDto: CreateStudentDto,
  ): Promise<StudentResponseDto> {
    return this.studentService.verifyAndCreate(verifyOtpDto, createStudentDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('JWT-auth')
  @ApiOperation({ 
    summary: 'Get all students',
    description: 'Retrieves a paginated list of all students. Requires JWT authentication and admin role. Include the JWT token in the Authorization header as: Bearer <token>'
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
    example: 1
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page (default: 10)',
    example: 10
  })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of students',
    type: StudentListResponseDto
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing JWT token'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - Admin access required'
  })
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<StudentListResponseDto> {
    return this.studentService.findAll(paginationDto);
  }
} 
