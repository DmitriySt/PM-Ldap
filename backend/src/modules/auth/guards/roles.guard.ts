import {
  CanActivate,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common/interfaces/features/execution-context.interface';
import { AuthUserInfoDto } from 'modules/auth/dto/auth-user-info.dto';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles-auth.decorator';
import { JwtTokenService } from '../services/jwt-token.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private jwtTokenService: JwtTokenService,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (!requiredRoles) {
        return true;
      }
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        throw new UnauthorizedException({
          message: 'Пользователь не авторизован',
        });
      }

      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({
          message: 'Пользователь не авторизован',
        });
      }
      const user: AuthUserInfoDto =
        this.jwtTokenService.validateAccessToken(token);

      if (!user) {
        throw new UnauthorizedException({
          message: 'Пользователь не авторизован',
        });
      }
      req.user = user;

      return user.roles.some((role) => requiredRoles.includes(role));
    } catch (e) {
      if (e instanceof UnauthorizedException) {
        throw e;
      } else {
        throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN);
      }
    }
  }
}
