import { JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';

interface config {
  jwt: {
    access: JwtSignOptions & JwtVerifyOptions;
    refresh: JwtSignOptions & JwtVerifyOptions;
  };
}

export const jwtConfig = () =>
  <config>{
    jwt: {
      access: {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
      },
      refresh: {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '3d',
      },
    },
  };
