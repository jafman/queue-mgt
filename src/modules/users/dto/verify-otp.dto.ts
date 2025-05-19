import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({
    description: '6-digit OTP sent to email',
    example: '123456',
    minLength: 6,
    maxLength: 6
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  otp: string;

  @ApiProperty({
    description: 'Email address to verify',
    example: 'student@university.edu'
  })
  @IsString()
  @IsNotEmpty()
  email: string;
} 