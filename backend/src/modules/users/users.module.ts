import { forwardRef, Module } from '@nestjs/common';
import { CryptoService } from 'modules/auth/services/crypto.service';
import { UsersService } from './services/users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/users.model';
import { LdapProvider } from './providers/ldap.provider';
import { LdapService } from 'modules/auth/services/ldap.service';
import { RolesModule } from 'modules/roles/roles.module';
import { AuthModule } from 'modules/auth/auth.module';

@Module({
  controllers: [],
  providers: [UsersService, LdapProvider, LdapService, CryptoService],
  imports: [
    SequelizeModule.forFeature([User]),
    forwardRef(() => RolesModule),
    forwardRef(() => AuthModule),
  ],
  exports: [LdapService, UsersService],
})
export class UsersModule {}
