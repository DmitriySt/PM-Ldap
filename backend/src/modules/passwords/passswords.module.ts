import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CryptoService } from 'modules/auth/services/crypto.service';
import { PasswordGroupController } from 'modules/passwords/controllers/password-group.controller';
import { PasswordGroup } from 'modules/passwords/models/password-group.model';
import { Password } from 'modules/passwords/models/password.model';
import { PasswordGroupService } from 'modules/passwords/services/password-group.service';
import { PasswordService } from './services/password.service';
import { PasswordsController } from './controllers/passwords.controller';
import { AuthModule } from 'modules/auth/auth.module';

@Module({
  controllers: [PasswordsController, PasswordGroupController],
  providers: [PasswordService, CryptoService, PasswordGroupService],
  imports: [
    SequelizeModule.forFeature([Password, PasswordGroup]),
    forwardRef(() => AuthModule),
  ],
})
export class PasswordsModule {}
