import { Vendor } from '../../users/entities/vendor.entity';
import { Student } from '../../users/entities/student.entity';
import { Transaction } from '../../wallet/entities/transaction.entity';
export declare enum QueueStatus {
    PENDING = "pending",
    SERVING = "serving",
    COMPLETED = "completed"
}
export declare class Queue {
    id: string;
    vendorId: string;
    studentId: string;
    transactionId: string;
    status: QueueStatus;
    position: number;
    createdAt: Date;
    servedAt: Date;
    vendor: Vendor;
    student: Student;
    transaction: Transaction;
}
