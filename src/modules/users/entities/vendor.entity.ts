import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum BusinessCategory {
  FOOD_AND_NUTRITION = 'Food and Nutrition',
  FASHION = 'Fashion',
  ELECTRONICS = 'Electronics'
}

@Entity('vendors')
export class Vendor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  business_name: string;

  @Column({
    type: 'enum',
    enum: BusinessCategory,
    default: BusinessCategory.FOOD_AND_NUTRITION
  })
  business_category: BusinessCategory;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: true })
  firstTimeLogin: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 