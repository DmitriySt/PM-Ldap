import { ConfigService } from '@nestjs/config';
import { IUserValidator } from 'modules/auth/types/user-validator.interface';
import { AuthUserDto } from 'modules/auth/dto/auth-user.dto';
import { LdapService } from 'modules/auth/services/ldap.service';
import { UsersService } from 'modules/users/services/users.service';
import { User } from 'modules/users/models/users.model';

export class LdapValidator implements IUserValidator {
  constructor(
    private ldapService: LdapService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async validate(authUserDto: AuthUserDto): Promise<User> {
    const domain = this.configService.get('ldap.domain');
    const group = this.configService.get('ldap.group');
    const username = `${authUserDto.username}@${domain}`;
    await this.ldapService.bind(username, authUserDto.password);
    const { displayName, memberOf } = await this.ldapService.findUserByName(
      authUserDto.username,
    );
    if (group && !memberOf.includes(group)) {
      return null;
    }
    let user = await this.usersService.findByName(authUserDto.username);
    if (!user) {
      user = await this.usersService.createUser({
        ...authUserDto,
        displayName,
      });
    }
    return user;
  }
}
