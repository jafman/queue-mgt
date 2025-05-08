import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../entities/admin.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  async findByUsername(username: string): Promise<Admin | null> {
    return this.adminRepository.findOne({ where: { username } });
  }

  async findByUsernameOrEmail(identifier: string): Promise<Admin | null> {
    return this.adminRepository.findOne({
      where: [
        { username: identifier },
        { email: identifier }
      ]
    });
  }
} 