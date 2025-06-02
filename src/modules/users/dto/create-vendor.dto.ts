import { IsString, IsNotEmpty, IsEmail, IsOptional, MinLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BusinessCategory } from '../enums/business-category.enum';

export class CreateVendorDto {
  @ApiProperty({
    description: 'Username for the vendor account',
    example: 'campus.cafe'
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Vendor\'s full name',
    example: 'John Doe'
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Business name',
    example: 'Campus Cafe'
  })
  @IsString()
  @IsNotEmpty()
  business_name: string;

  @ApiProperty({
    description: 'Business category',
    enum: BusinessCategory,
    example: BusinessCategory.FOOD_AND_NUTRITION
  })
  @IsEnum(BusinessCategory)
  business_category: BusinessCategory;

  @ApiProperty({
    description: 'Vendor\'s email address',
    example: 'john@campus.cafe'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Vendor\'s phone number',
    example: '+2348012345678',
    required: false
  })
  @IsString()
  @IsOptional()
  phone?: string;
} 