import { forwardRef, Module } from '@nestjs/common';
import { CryptoService } from 'modules/auth/services/crypto.service';
import { AuthController } from './controllers/auth.controller';
import { UsersModule } from 'modules/users/users.module';
import { AuthService } from './services/auth.service';
import { UserValidator } from './providers/user-validator.provider';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtTokenService } from './services/jwt-token.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Token } from './models/token.model';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserValidator, JwtTokenService, CryptoService],
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        configService.get('jwt.access'),
      inject: [ConfigService],
    }),
    SequelizeModule.forFeature([Token]),
  ],
  exports: [JwtTokenService, CryptoService],
})
export class AuthModule {}
