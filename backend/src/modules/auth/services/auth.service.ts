import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AuthUserDto } from 'modules/auth/dto/auth-user.dto';
import { IUserValidator } from 'modules/auth/types/user-validator.interface';
import { ConfigService } from '@nestjs/config';
import { JwtTokenService } from './jwt-token.service';
import { UsersService } from 'modules/users/services/users.service';
import { AuthUserInfoDto } from 'modules/auth/dto/auth-user-info.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('UserValidator') private userValidator: IUserValidator,
    private configService: ConfigService,
    private jwtTokenService: JwtTokenService,
    private usersService: UsersService,
  ) {}

  async login(authUserDto: AuthUserDto) {
    const user = await this.userValidator.validate(authUserDto);
    if (!user) {
      throw new HttpException('Ошибка авторизации', HttpStatus.UNAUTHORIZED);
    }
    const userInfo = new AuthUserInfoDto(user);
    const tokens = await this.jwtTokenService.generateTokens(userInfo);
    return { ...tokens, userInfo };
  }

  async logout(userId: number) {
    return await this.jwtTokenService.deleteRefreshToken(userId);
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new HttpException(
        'Ошибка проверки токена',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const userData = this.jwtTokenService.validateRefreshToken(refreshToken);
    if (!userData) {
      throw new HttpException(
        'Ошибка проверки токена',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const tokenDbData = await this.jwtTokenService.findRefreshToken(
      userData.id,
      refreshToken,
    );
    if (!tokenDbData) {
      throw new HttpException(
        'Ошибка проверки токена',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const user = await this.usersService.findById(userData.id);
    const userInfo = new AuthUserInfoDto(user);
    const tokens = await this.jwtTokenService.generateTokens(userInfo);
    return { ...tokens, userInfo };
  }
}
