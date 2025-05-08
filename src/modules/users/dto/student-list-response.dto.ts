import { ApiProperty } from '@nestjs/swagger';
import { Student } from '../entities/student.entity';

export class StudentListResponseDto {
  @ApiProperty({ type: [Student] })
  data: Student[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
} 