import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Wallet } from './wallet.entity';

export enum TransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit'
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: TransactionType
  })
  type: TransactionType;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  reference: string;

  @Column({ nullable: true })
  relatedTransactionId: string;

  @Column({ nullable: true })
  relatedUserId: string;

  @ManyToOne(() => Wallet, wallet => wallet.transactions)
  wallet: Wallet;

  @CreateDateColumn()
  createdAt: Date;
} 