import { ApiProperty } from '@nestjs/swagger';
import { StudentResponseDto } from './student-response.dto';

export class StudentListResponseDto {
  @ApiProperty({
    description: 'List of students',
    type: [StudentResponseDto],
    example: [
      {
        id: 'uuid',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneNumber: '+1234567890',
        department: 'Computer Science',
        level: '400',
        studentId: 'STU2023001',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
      }
    ]
  })
  data: StudentResponseDto[];

  @ApiProperty({
    description: 'Current page number',
    example: 1
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of items',
    example: 100
  })
  total: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 10
  })
  totalPages: number;
} 