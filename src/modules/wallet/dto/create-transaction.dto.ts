import { IsNumber, IsEnum, IsString, IsOptional, Min, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionType, TransactionStatus } from '../entities/transaction.entity';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Amount to credit, debit, or transfer',
    example: 100.50,
    minimum: 0.01
  })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({
    description: 'Type of transaction',
    enum: TransactionType,
    example: TransactionType.CREDIT
  })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({
    description: 'Description of the transaction',
    example: 'Payment for lunch',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Reference number for the transaction',
    example: 'TRX123456',
    required: false
  })
  @IsString()
  @IsOptional()
  reference?: string;

  @ApiProperty({
    description: 'Recipient ID (required for transfers)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false
  })
  @IsUUID()
  @IsOptional()
  recipientId?: string;

  @ApiProperty({
    description: 'Recipient type (required for transfers)',
    example: 'vendor',
    required: false
  })
  @IsString()
  @IsOptional()
  recipientType?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  relatedTransactionId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  relatedUserId?: string;

  @ApiProperty({ enum: TransactionStatus, required: false })
  @IsEnum(TransactionStatus)
  @IsOptional()
  status?: TransactionStatus;
} 