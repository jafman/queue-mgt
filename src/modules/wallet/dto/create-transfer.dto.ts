import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsEnum, Min } from 'class-validator';

export enum RecipientType {
  STUDENT = 'student',
  VENDOR = 'vendor',
}

export class CreateTransferDto {
  @ApiProperty({
    description: 'Amount to transfer',
    example: 1000.50,
    minimum: 1
  })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({
    description: 'Username of the recipient',
    example: 'john.doe'
  })
  @IsString()
  @IsNotEmpty()
  recipientUsername: string;

  @ApiProperty({
    description: 'Type of recipient (student or vendor)',
    enum: RecipientType,
    example: RecipientType.STUDENT
  })
  @IsEnum(RecipientType)
  recipientType: RecipientType;
} 