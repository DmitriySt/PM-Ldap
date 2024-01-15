import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client as LdapClient } from 'ldapts';

import { UserLdapDto } from 'modules/users/dto/user-ldap.dto';

@Injectable()
export class LdapService {
  constructor(
    @Inject('LdapClient') private ldapClient: LdapClient,
    private configService: ConfigService,
  ) {}

  async bind(username: string, password: string) {
    try {
      await this.ldapClient.bind(username, password);
      return this.ldapClient.isConnected;
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException('Ошибка авторизации на сервере LDAP');
    }
  }

  async findUserByName(username: string): Promise<UserLdapDto> {
    const { searchEntries } = await this.ldapClient.search(
      this.configService.get('ldap.dn'),
      {
        filter: `sAMAccountName=${username}`,
        sizeLimit: 1,
        attributes: ['displayName', 'memberOf'],
      },
    );
    if (!searchEntries.length) {
      throw new BadRequestException('Пользователь не найден');
    }
    const user = searchEntries[0];
    return {
      displayName: user.displayName.toString(),
      memberOf: user.memberOf,
    };
  }
}
