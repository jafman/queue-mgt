import { IsNumber, Min, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InitializeWalletFundingDto {
  @ApiProperty({
    description: 'Amount to fund wallet in Naira',
    example: 1000,
    minimum: 100,
    type: Number
  })
  @IsNumber()
  @Min(100) // Minimum amount in kobo (₦1)
  amount: number;

  @ApiProperty({
    description: 'Email address for payment',
    example: 'user@example.com',
    type: String
  })
  @IsEmail()
  email: string;
} 