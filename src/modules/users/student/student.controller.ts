import { Controller, Post, Body, Get, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { StudentService } from './student.service';
import { CreateStudentDto } from '../dto/create-student.dto';
import { StudentResponseDto } from '../dto/student-response.dto';
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

  @Post()
  @ApiOperation({ 
    summary: 'Create a new student',
    description: 'Creates a new student account with the provided information. Username, email, and studentId must be unique.'
  })
  @ApiBody({ 
    type: CreateStudentDto,
    description: 'Student registration information',
    examples: {
      example1: {
        value: {
          username: 'john.doe2023',
          email: 'john.doe@university.edu',
          password: 'SecurePass123!',
          firstName: 'John',
          lastName: 'Doe',
          studentId: 'STU2023001'
        },
        summary: 'Example student registration'
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'The student has been successfully created',
    type: StudentResponseDto
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Conflict - Username, email, or studentId already exists',
    schema: {
      example: {
        statusCode: 409,
        message: 'Username already exists',
        error: 'Conflict'
      }
    }
  })
  async create(@Body() createStudentDto: CreateStudentDto): Promise<StudentResponseDto> {
    return this.studentService.create(createStudentDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get all students',
    description: 'Retrieves a paginated list of all students. Only accessible by admin users.'
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