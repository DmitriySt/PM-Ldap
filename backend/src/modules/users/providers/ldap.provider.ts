import { ConfigService } from '@nestjs/config';
import { Client } from 'ldapts';
import { Provider } from '@nestjs/common';

export const LdapProvider: Provider<Client> = {
  provide: 'LdapClient',
  useFactory: (configService: ConfigService) => {
    return configService.get('ldap.ssl') === 'true'
      ? new Client({
          url: `ldaps://${configService.get('ldap.host')}:${configService.get(
            'ldap.port',
          )}`,
          tlsOptions: {
            rejectUnauthorized: false,
          },
        })
      : new Client({
          url: `ldap://${configService.get('ldap.host')}:${configService.get(
            'ldap.port',
          )}`,
        });
  },
  inject: [ConfigService],
};
