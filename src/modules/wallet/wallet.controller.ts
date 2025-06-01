import { Controller, Get, Post, Body, UseGuards, Query, Request, Req, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/enums/role.enum';
import { PaystackService } from './paystack.service';
import { InitializeWalletFundingDto } from './dto/initialize-wallet-funding.dto';
import { Transaction, TransactionType, TransactionStatus } from './entities/transaction.entity';
import { CreateTransferDto } from './dto/create-transfer.dto';

@ApiTags('Wallet')
@Controller('wallet')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly paystackService: PaystackService,
  ) {}

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
          example: 50,
          description: 'Total number of transactions'
        },
        currentPage: {
          type: 'number',
          example: 1,
          description: 'Current page number'
        },
        totalPages: {
          type: 'number',
          example: 5,
          description: 'Total number of pages'
        },
        hasNextPage: {
          type: 'boolean',
          example: true,
          description: 'Whether there is a next page'
        },
        hasPreviousPage: {
          type: 'boolean',
          example: false,
          description: 'Whether there is a previous page'
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

  @Post('initialize-funding')
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: 'Initialize wallet funding via Paystack' })
  @ApiResponse({
    status: 201,
    description: 'Funding initialization successful',
    schema: {
      type: 'object',
      properties: {
        access_code: {
          type: 'string',
          example: 'nkdks46nymizns7',
          description: 'Paystack access code for payment'
        },
        reference: {
          type: 'string',
          example: 'nms6uvr1pl',
          description: 'Paystack transaction reference'
        },
        authorization_url: {
          type: 'string',
          example: 'https://checkout.paystack.com/nkdks46nymizns7',
          description: 'URL to redirect user for payment'
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid amount or email'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have required role'
  })
  async initializeFunding(
    @Req() req,
    @Body() initializeFundingDto: InitializeWalletFundingDto,
  ) {
    const { amount, email } = initializeFundingDto;

    // Initialize Paystack transaction
    const paystackResponse = await this.paystackService.initializeTransaction(email, amount);

    // Create pending transaction record
    const transaction = await this.walletService.createTransaction(
      req.user.id,
      req.user.role,
      {
        amount,
        type: TransactionType.CREDIT,
        description: 'Wallet funding via Paystack',
        reference: paystackResponse.data.reference,
        status: TransactionStatus.PENDING,
      },
    );

    return {
      access_code: paystackResponse.data.access_code,
      reference: paystackResponse.data.reference,
      authorization_url: paystackResponse.data.authorization_url,
    };
  }

  @Post('transfer')
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: 'Transfer funds to another user' })
  @ApiResponse({
    status: 201,
    description: 'Transfer successful',
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
          enum: ['debit'],
          example: 'debit'
        },
        description: {
          type: 'string',
          example: 'Transfer to john.doe'
        },
        relatedUserId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000'
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
    description: 'Bad Request - Insufficient balance or invalid transfer details'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have required role'
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Recipient not found'
  })
  async transfer(
    @Request() req,
    @Body() createTransferDto: CreateTransferDto,
  ) {
    return this.walletService.transfer(
      req.user.id,
      req.user.role,
      createTransferDto,
    );
  }
} 