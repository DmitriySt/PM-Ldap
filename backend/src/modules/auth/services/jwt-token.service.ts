import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { Token } from '../models/token.model';
import * as bcrypt from 'bcryptjs';
import { AuthUserInfoDto } from '../dto/auth-user-info.dto';

@Injectable()
export class JwtTokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectModel(Token) private tokenRepository: typeof Token,
  ) {}

  async generateTokens(user: AuthUserInfoDto) {
    const payload = { ...user };
    const accessToken = this.jwtService.sign(
      payload,
      this.configService.get('jwt.access'),
    );
    const refreshToken = this.jwtService.sign(
      payload,
      this.configService.get('jwt.refresh'),
    );
    await this.saveToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async saveToken(userId: number, refreshToken: string): Promise<Token> {
    const tokenData = await this.tokenRepository.findOne({ where: { userId } });
    const hashToken = await bcrypt.hash(refreshToken, 8);
    if (tokenData) {
      tokenData.refreshToken = hashToken;
      return tokenData.save();
    }
    return this.tokenRepository.create({ userId, refreshToken: hashToken });
  }

  async findRefreshToken(userId: number, token: string): Promise<Token> | null {
    const tokenData = await this.tokenRepository.findOne({ where: { userId } });
    if (!tokenData) {
      return null;
    }
    const validate = await bcrypt.compare(token, tokenData.refreshToken);
    if (!validate) {
      return null;
    }
    return tokenData;
  }

  validateAccessToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token: string) {
    try {
      return this.jwtService.verify(
        token,
        this.configService.get('jwt.refresh'),
      );
    } catch (e) {
      return null;
    }
  }

  async deleteRefreshToken(userId: number) {
    return await this.tokenRepository.destroy({ where: { userId } });
  }
}
