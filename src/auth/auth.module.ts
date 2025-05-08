import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './services/auth.service';
import { VendorModule } from '../modules/users/vendor/vendor.module';
import { StudentModule } from '../modules/users/student/student.module';
import { AdminModule } from '../modules/users/admin/admin.module';
import { VendorAuthController } from './controllers/vendor-auth.controller';
import { StudentAuthController } from './controllers/student-auth.controller';
import { AdminAuthController } from './controllers/admin-auth.controller';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRATION') },
      }),
      inject: [ConfigService],
    }),
    VendorModule,
    StudentModule,
    AdminModule,
  ],
  controllers: [
    VendorAuthController,
    StudentAuthController,
    AdminAuthController,
  ],
  providers: [AuthService],
})
export class AuthModule {} 