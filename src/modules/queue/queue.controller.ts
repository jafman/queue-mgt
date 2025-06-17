import { Controller, Get, Post, UseGuards, Request, Param, BadRequestException, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/enums/role.enum';
import { QueueService } from './queue.service';
import { Queue } from './entities/queue.entity';
import { CompleteQueueDto } from './dto/complete-queue.dto';

@ApiTags('Queue')
@Controller('queue')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

//   @Get('position')
//   @Roles(Role.STUDENT)
//   @ApiOperation({ summary: 'Get student\'s position in queue' })
//   @ApiResponse({
//     status: 200,
//     description: 'Returns student\'s position in queue',
//     schema: {
//       type: 'object',
//       properties: {
//         position: {
//           type: 'number',
//           example: 3,
//           description: 'Position in queue (1-based)'
//         }
//       }
//     }
//   })
//   async getQueuePosition(@Request() req) {
//     return this.queueService.getQueuePosition(req.user.id);
//   }

  @Get('vendor')
  @Roles(Role.VENDOR)
  @ApiOperation({ summary: 'Get vendor\'s queue' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of students in vendor\'s queue',
    type: [Queue]
  })
  async getVendorQueue(@Request() req) {
    return this.queueService.getVendorQueue(req.user.id);
  }

  @Post('complete')
  @Roles(Role.VENDOR)
  @ApiOperation({ summary: 'Complete a student\'s queue entry and serve next in line' })
  @ApiResponse({
    status: 200,
    description: 'Returns the completed queue entry',
    type: Queue
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found or not in queue'
  })
  async completeStudent(
    @Request() req,
    @Body() completeQueueDto: CompleteQueueDto
  ) {
    return this.queueService.completeStudent(
      req.user.id,
      completeQueueDto.studentEmail
    );
  }

//   @Get('current')
//   @Roles(Role.VENDOR)
//   @ApiOperation({ summary: 'Get currently serving student' })
//   @ApiResponse({
//     status: 200,
//     description: 'Returns the currently serving student',
//     type: Queue
//   })
//   async getCurrentServing(@Request() req) {
//     return this.queueService.getCurrentServing(req.user.id);
//   }
} 