import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/enums/role.enum';
import { StatsService } from './stats.service';

@ApiTags('Statistics')
@Controller('stats')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('vendor')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get vendor statistics' })
  @ApiResponse({
    status: 200,
    description: 'Returns vendor statistics',
    schema: {
      type: 'object',
      properties: {
        allVendors: {
          type: 'number',
          example: 100,
          description: 'Total number of vendors'
        },
        activeVendors: {
          type: 'number',
          example: 80,
          description: 'Number of active vendors'
        },
        inactiveVendors: {
          type: 'number',
          example: 0,
          description: 'Number of inactive vendors (always 0)'
        },
        pendingVendors: {
          type: 'number',
          example: 20,
          description: 'Number of vendors who haven\'t logged in for the first time'
        }
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
  async getVendorStats() {
    return this.statsService.getVendorStats();
  }
} 