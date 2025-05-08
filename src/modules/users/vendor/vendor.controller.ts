import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from '../dto/create-vendor.dto';
import { Vendor } from '../entities/vendor.entity';

@ApiTags('Vendors')
@Controller('vendors')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new vendor' })
  @ApiBody({ type: CreateVendorDto })
  @ApiResponse({ 
    status: 201, 
    description: 'The vendor has been successfully created',
    type: Vendor,
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Username already exists',
  })
  async create(@Body() createVendorDto: CreateVendorDto): Promise<Vendor> {
    return this.vendorService.create(createVendorDto);
  }
} 