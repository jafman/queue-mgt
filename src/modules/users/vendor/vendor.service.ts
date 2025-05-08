import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from '../entities/vendor.entity';
import { CreateVendorDto } from '../dto/create-vendor.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
  ) {}

  async findByUsername(username: string): Promise<Vendor | null> {
    return this.vendorRepository.findOne({ where: { username } });
  }

  async create(createVendorDto: CreateVendorDto): Promise<Vendor> {
    const existingVendor = await this.findByUsername(createVendorDto.username);
    if (existingVendor) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(createVendorDto.password, 10);
    const vendor = this.vendorRepository.create({
      ...createVendorDto,
      password: hashedPassword,
    });

    return this.vendorRepository.save(vendor);
  }
} 