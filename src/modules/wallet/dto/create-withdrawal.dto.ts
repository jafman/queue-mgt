import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, Min } from 'class-validator';

export class CreateWithdrawalDto {
  @ApiProperty({
    description: 'Amount to withdraw',
    example: 1000.50,
    minimum: 1
  })
  @IsNumber()
  @IsPositive()
  @Min(1)
  amount: number;
} 