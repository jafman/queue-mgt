import { Controller, Get, Post, Body, UseGuards, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/enums/role.enum';

@ApiTags('Wallet')
@Controller('wallet')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('balance')
  @Roles(Role.STUDENT, Role.VENDOR)
  @ApiOperation({ summary: 'Get wallet balance' })
  @ApiResponse({
    status: 200,
    description: 'Returns the current wallet balance and user email',
    schema: {
      type: 'object',
      properties: {
        balance: {
          type: 'number',
          example: 1000.50
        },
        email: {
          type: 'string',
          example: 'user@example.com'
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
  async getBalance(@Request() req) {
    return this.walletService.getWalletBalance(
      req.user.id,
      req.user.role,
    );
  }

  @Post('transactions')
  @Roles(Role.STUDENT, Role.VENDOR)
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({
    status: 201,
    description: 'Transaction created successfully',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000'
        },
        amount: {
          type: 'number',
          example: 100.50
        },
        type: {
          type: 'string',
          enum: ['credit', 'debit'],
          example: 'credit'
        },
        description: {
          type: 'string',
          example: 'Payment for lunch'
        },
        reference: {
          type: 'string',
          example: 'TRX123456'
        },
        relatedUserId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000',
          nullable: true
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-03-19T12:00:00Z'
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Insufficient balance for debit transaction'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have required role'
  })
  async createTransaction(
    @Request() req,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return this.walletService.createTransaction(
      req.user.id,
      req.user.role,
      createTransactionDto,
    );
  }

  @Get('transactions')
  @Roles(Role.STUDENT, Role.VENDOR)
  @ApiOperation({ summary: 'Get transaction history' })
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
    description: 'Returns paginated transaction history',
    schema: {
      type: 'object',
      properties: {
        transactions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '123e4567-e89b-12d3-a456-426614174000'
              },
              amount: {
                type: 'number',
                example: 100.50
              },
              type: {
                type: 'string',
                enum: ['credit', 'debit'],
                example: 'credit'
              },
              description: {
                type: 'string',
                example: 'Payment for lunch'
              },
              reference: {
                type: 'string',
                example: 'TRX123456'
              },
              relatedUserId: {
                type: 'string',
                example: '123e4567-e89b-12d3-a456-426614174000',
                nullable: true
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2024-03-19T12:00:00Z'
              }
            }
          }
        },
        total: {
          type: 'number',
          example: 50
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
  async getTransactionHistory(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.walletService.getTransactionHistory(
      req.user.id,
      req.user.role,
      page,
      limit,
    );
  }
} 