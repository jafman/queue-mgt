import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from '../users/entities/vendor.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
  ) {}

  async getVendorStats() {
    // Get total number of vendors
    const allVendors = await this.vendorRepository.count();

    // Get number of pending vendors (firstTimeLogin = true)
    const pendingVendors = await this.vendorRepository.count({
      where: { firstTimeLogin: true }
    });

    // Calculate active vendors (total - pending)
    const activeVendors = allVendors - pendingVendors;

    // Inactive vendors is always 0
    const inactiveVendors = 0;

    return {
      allVendors,
      activeVendors,
      inactiveVendors,
      pendingVendors
    };
  }
} 