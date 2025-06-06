import { Controller, Post, Body, UseGuards, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from '../dto/create-vendor.dto';
import { Vendor } from '../entities/vendor.entity';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { Role } from '../../../auth/enums/role.enum';

@ApiTags('Vendors')
@Controller('vendors')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new vendor (Admin only)' })
  @ApiBody({ type: CreateVendorDto })
  @ApiResponse({ 
    status: 201, 
    description: 'The vendor has been successfully created and invitation email sent',
    type: Vendor,
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Username already exists',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have admin role'
  })
  async create(@Body() createVendorDto: CreateVendorDto): Promise<Omit<Vendor, 'password'>> {
    return this.vendorService.create(createVendorDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all vendors' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
    example: 1
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page (default: 10)',
    example: 10
  })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of vendors',
    schema: {
      type: 'object',
      properties: {
        vendors: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
              username: { type: 'string', example: 'vendor1' },
              name: { type: 'string', example: 'John Doe' },
              email: { type: 'string', example: 'john@example.com' },
              phone: { type: 'string', example: '+2348012345678' },
              business_name: { type: 'string', example: 'John\'s Store' },
              business_category: { type: 'string', enum: ['FOOD', 'RETAIL', 'SERVICES'] },
              firstTimeLogin: { type: 'boolean', example: true },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
          }
        },
        total: { type: 'number', example: 50 },
        currentPage: { type: 'number', example: 1 },
        totalPages: { type: 'number', example: 5 },
        hasNextPage: { type: 'boolean', example: true },
        hasPreviousPage: { type: 'boolean', example: false }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have required role'
  })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.vendorService.findAll(page, limit);
  }
} 