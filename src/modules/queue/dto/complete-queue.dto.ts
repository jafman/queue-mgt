import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CompleteQueueDto {
  @ApiProperty({
    description: 'Email of the student to complete',
    example: 'john.doe@gmail.com'
  })
  @IsEmail()
  @IsNotEmpty()
  studentEmail: string;
} 