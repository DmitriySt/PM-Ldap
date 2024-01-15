import { AuthUserDto } from '../dto/auth-user.dto';
import { User } from 'modules/users/models/users.model';

export interface IUserValidator {
  validate(authUserDto: AuthUserDto): Promise<User>;
}
