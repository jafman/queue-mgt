import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
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

  @Get('student')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get student statistics' })
  @ApiResponse({
    status: 200,
    description: 'Returns student statistics',
    schema: {
      type: 'object',
      properties: {
        allStudents: {
          type: 'number',
          example: 500,
          description: 'Total number of students'
        },
        activeStudents: {
          type: 'number',
          example: 500,
          description: 'Number of active students'
        },
        inactiveStudents: {
          type: 'number',
          example: 0,
          description: 'Number of inactive students (always 0)'
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
  async getStudentStats() {
    return this.statsService.getStudentStats();
  }

  @Get('transactions')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get transaction statistics' })
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
    description: 'Returns transaction statistics and paginated transactions',
    schema: {
      type: 'object',
      properties: {
        stats: {
          type: 'object',
          properties: {
            totalCreditAmount: {
              type: 'number',
              example: 50000.50,
              description: 'Total amount of credit transactions'
            },
            totalDebitAmount: {
              type: 'number',
              example: 30000.25,
              description: 'Total amount of debit transactions'
            },
            totalTransactionAmount: {
              type: 'number',
              example: 80000.75,
              description: 'Total amount of all transactions'
            }
          }
        },
        transactions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
              amount: { type: 'number', example: 100.50 },
              type: { type: 'string', enum: ['credit', 'debit'] },
              description: { type: 'string' },
              status: { type: 'string', enum: ['success', 'pending', 'failed'] },
              createdAt: { type: 'string', format: 'date-time' }
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
  async getTransactionStats(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.statsService.getTransactionStats(page, limit);
  }

  @Get('overview')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get system overview statistics' })
  @ApiResponse({
    status: 200,
    description: 'Returns system overview statistics',
    schema: {
      type: 'object',
      properties: {
        totalTransactionsAmount: {
          type: 'number',
          example: 80000.75,
          description: 'Total amount of all transactions'
        },
        totalVendors: {
          type: 'number',
          example: 100,
          description: 'Total number of vendors'
        },
        totalStudents: {
          type: 'number',
          example: 500,
          description: 'Total number of students'
        },
        recentActivities: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
              amount: { type: 'number', example: 100.50 },
              type: { type: 'string', enum: ['credit', 'debit'] },
              description: { type: 'string' },
              status: { type: 'string', enum: ['success', 'pending', 'failed'] },
              createdAt: { type: 'string', format: 'date-time' }
            }
          },
          description: 'Last 10 transactions'
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
  async getOverview() {
    return this.statsService.getOverview();
  }
} 