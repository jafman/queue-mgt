import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Vendor } from '../../users/entities/vendor.entity';
import { Student } from '../../users/entities/student.entity';
import { Transaction } from '../../wallet/entities/transaction.entity';

export enum QueueStatus {
  PENDING = 'pending',
  SERVING = 'serving',
  COMPLETED = 'completed'
}

@Entity('queues')
export class Queue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  vendorId: string;

  @Column()
  studentId: string;

  @Column()
  transactionId: string;

  @Column({
    type: 'enum',
    enum: QueueStatus,
    default: QueueStatus.PENDING
  })
  status: QueueStatus;

  @Column()
  position: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  servedAt: Date;

  @ManyToOne(() => Vendor)
  @JoinColumn({ name: 'vendorId' })
  vendor: Vendor;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @ManyToOne(() => Transaction)
  @JoinColumn({ name: 'transactionId' })
  transaction: Transaction;
} 