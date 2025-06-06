import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from '../entities/vendor.entity';
import { CreateVendorDto } from '../dto/create-vendor.dto';
import { MailerService } from '../../../mailer/mailer.service';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

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

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async findByUsername(username: string): Promise<Vendor | null> {
    return this.vendorRepository.findOne({ where: { username } });
  }

  async findByUsernameOrEmail(identifier: string): Promise<Vendor | null> {
    return this.vendorRepository.findOne({
      where: [
        { username: identifier },
        { email: identifier }
      ]
    });
  }

  async create(createVendorDto: CreateVendorDto): Promise<Omit<Vendor, 'password'>> {
    // Check if username already exists
    const existingVendor = await this.vendorRepository.findOne({
      where: [
        { username: createVendorDto.username },
        { email: createVendorDto.email },
        { phone: createVendorDto.phone }
      ]
    });

    if (existingVendor) {
      if (existingVendor.username === createVendorDto.username) {
        throw new ConflictException('Username already exists');
      }
      if (existingVendor.email === createVendorDto.email) {
        throw new ConflictException('Email already exists');
      }
      if (existingVendor.phone === createVendorDto.phone) {
        throw new ConflictException('Phone number already exists');
      }
    }

    // Generate a random password
    // const plainPassword = this.generatePassword();
    const plainPassword = 'PASSWORD';
    // console.log({plainPassword});
    // Create the vendor with hashed password
    const vendor = this.vendorRepository.create({
      ...createVendorDto,
      password: await this.hashPassword(plainPassword),
      firstTimeLogin: true
    });

    // Save the vendor
    const savedVendor = await this.vendorRepository.save(vendor);

    // Send invitation email with plain password
    await this.mailerService.sendEmail({
      to: savedVendor.email,
      toName: savedVendor.name,
      subject: 'VENDOR INVITATION',
      html: `
        <p>Hi, ${savedVendor.name}</p>
        <p>You have been invited to join QUICKP as a vendor. Your Account has been created and added to the platform.</p>
        <p>Login to the app <a href="https://www.quickp.com.ng/">https://www.quickp.com.ng/</a> using the following password: <strong>${plainPassword}</strong></p>
      `,
      text: `Hi, ${savedVendor.name}. You have been invited to join QUICKP as a vendor. Your Account has been created and added to the platform. Login to the app https://www.quickp.com.ng/ using the following password: ${plainPassword}`
    });

    // Remove password from response
    const { password: _, ...vendorWithoutPassword } = savedVendor;
    return vendorWithoutPassword;
  }

  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    await this.vendorRepository.update(id, { password: hashedPassword });
  }

  async updateFirstTimeLogin(id: string, value: boolean): Promise<void> {
    await this.vendorRepository.update(id, { firstTimeLogin: value });
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{
    vendors: Omit<Vendor, 'password'>[];
    total: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }> {
    const [vendors, total] = await this.vendorRepository.findAndCount({
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        phone: true,
        business_name: true,
        business_category: true,
        firstTimeLogin: true,
        createdAt: true,
        updatedAt: true
      },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      vendors,
      total,
      currentPage: page,
      totalPages,
      hasNextPage,
      hasPreviousPage
    };
  }
} 