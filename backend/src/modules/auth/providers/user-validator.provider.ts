import { ConfigService } from '@nestjs/config';
import { LdapValidator } from '../validators/ldap.validator';
import { UsersService } from 'modules/users/services/users.service';
import { LdapService } from 'modules/auth/services/ldap.service';

export const UserValidator = {
  provide: 'UserValidator',
  useFactory: (
    ldapService: LdapService,
    usersService: UsersService,
    configService: ConfigService,
  ) => {
    return new LdapValidator(ldapService, usersService, configService);
  },
  inject: [LdapService, UsersService, ConfigService],
};
