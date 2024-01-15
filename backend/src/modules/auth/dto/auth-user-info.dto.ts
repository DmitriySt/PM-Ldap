import { User } from 'modules/users/models/users.model';

export class AuthUserInfoDto {
  id: number;
  roles: string[];
  displayName: string;

  constructor(user: User) {
    this.id = user.id;
    this.roles = user.roles.map((item) => item.value);
    this.displayName = user.displayName;
  }
}
