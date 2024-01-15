import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'modules/auth/decorators/roles-auth.decorator';
import { RolesGuard } from 'modules/auth/guards/roles.guard';
import { AuthRequest } from 'modules/auth/types/auth-request.interface';
import { ROLE_USER } from 'modules/roles/const';
import { AuthService } from '../services/auth.service';
import { AuthUserDto } from '../dto/auth-user.dto';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(
    @Body() authUserDto: AuthUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    authUserDto.username = authUserDto.username.toLowerCase();
    const { accessToken, refreshToken, userInfo } =
      await this.authService.login(authUserDto);
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      signed: true,
      secure: true,
      sameSite: 'none',
    });

    return {
      accessToken,
      userInfo,
    };
  }

  @Get('/refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { refreshToken } = request.signedCookies;
    const {
      accessToken,
      refreshToken: newRefreshToken,
      userInfo,
    } = await this.authService.refresh(refreshToken);
    response.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      signed: true,
      secure: true,
      sameSite: 'none',
    });
    return {
      accessToken,
      userInfo,
    };
  }

  @Roles(ROLE_USER)
  @UseGuards(RolesGuard)
  @Get('/logout')
  async logout(
    @Req() request: AuthRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { refreshToken } = request.signedCookies;
    if (!refreshToken) return true;
    await this.authService.logout(request.user.id);
    response.clearCookie('refreshToken');
    return true;
  }
}
