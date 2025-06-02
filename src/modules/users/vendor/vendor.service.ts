import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from '../entities/vendor.entity';
import { CreateVendorDto } from '../dto/create-vendor.dto';
import { MailerService } from '../../../mailer/mailer.service';
import * as crypto from 'crypto';

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
    private mailerService: MailerService,
  ) {}

  private generatePassword(): string {
    // Generate a random 8-character password in uppercase
    return crypto.randomBytes(4).toString('hex').toUpperCase();
  }

  async findByUsername(username: string): Promise<Vendor | null> {
    return this.vendorRepository.findOne({ where: { username } });
  }

  async create(createVendorDto: CreateVendorDto): Promise<Vendor> {
    // Check if username already exists
    const existingVendor = await this.vendorRepository.findOne({
      where: { username: createVendorDto.username }
    });

    if (existingVendor) {
      throw new ConflictException('Username already exists');
    }

    // Generate a random password
    const password = this.generatePassword();
    console.log({password});
    // Create the vendor
    const vendor = this.vendorRepository.create({
      ...createVendorDto,
      password, // This should be hashed in a real implementation
      firstTimeLogin: true
    });

    // Save the vendor
    const savedVendor = await this.vendorRepository.save(vendor);

    // Send invitation email
    await this.mailerService.sendEmail({
      to: savedVendor.email,
      toName: savedVendor.name,
      subject: 'VENDOR INVITATION',
      html: `
        <p>Hi, ${savedVendor.name}</p>
        <p>You have been invited to join QUICKP as a vendor. Your Account has been created and added to the platform.</p>
        <p>Login to the app <a href="https://www.quickp.com.ng/">https://www.quickp.com.ng/</a> using the following password: <strong>${password}</strong></p>
      `,
      text: `Hi, ${savedVendor.name}. You have been invited to join QUICKP as a vendor. Your Account has been created and added to the platform. Login to the app https://www.quickp.com.ng/ using the following password: ${password}`
    });

    return savedVendor;
  }
} 