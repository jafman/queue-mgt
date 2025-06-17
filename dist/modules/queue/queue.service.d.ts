import { Repository } from 'typeorm';
import { Queue } from './entities/queue.entity';
import { Student } from '../users/entities/student.entity';
export declare class QueueService {
    private queueRepository;
    private studentRepository;
    constructor(queueRepository: Repository<Queue>, studentRepository: Repository<Student>);
    addToQueue(vendorId: string, studentId: string, transactionId: string): Promise<Queue>;
    getQueuePosition(studentId: string): Promise<number>;
    getVendorQueue(vendorId: string): Promise<Queue[]>;
    completeCurrent(vendorId: string): Promise<Queue>;
    getCurrentServing(vendorId: string): Promise<Queue | null>;
    completeStudent(vendorId: string, studentEmail: string): Promise<Queue>;
}
