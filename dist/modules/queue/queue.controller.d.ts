import { QueueService } from './queue.service';
import { Queue } from './entities/queue.entity';
import { CompleteQueueDto } from './dto/complete-queue.dto';
export declare class QueueController {
    private readonly queueService;
    constructor(queueService: QueueService);
    getVendorQueue(req: any): Promise<Queue[]>;
    completeStudent(req: any, completeQueueDto: CompleteQueueDto): Promise<Queue>;
}
