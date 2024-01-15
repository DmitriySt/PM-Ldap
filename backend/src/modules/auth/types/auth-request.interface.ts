import { AuthUserInfoDto } from 'modules/auth/dto/auth-user-info.dto';
import { Request } from 'express';

export interface AuthRequest extends Request {
  user: AuthUserInfoDto;
}
