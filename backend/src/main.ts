import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'app.module';
import * as cookieParser from 'cookie-parser';
import { validationPipeError } from 'helpers/error.helper';
import { install } from 'install';
import * as fs from 'fs';

async function bootstrap() {
  await install();
  let httpsOptions: { key: Buffer; cert: Buffer };
  if (process.env.SSL === 'true') {
    httpsOptions = {
      key: fs.readFileSync(process.env.SSL_KEY),
      cert: fs.readFileSync(process.env.SSL_CERT),
    };
  }
  const app = httpsOptions
    ? await NestFactory.create(AppModule, { httpsOptions })
    : await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (errors) => {
        throw new HttpException(
          { validationErrors: validationPipeError(errors) },
          HttpStatus.BAD_REQUEST,
        );
      },
    }),
  );
  const configService = app.get(ConfigService);
  const port = configService.get('app.port');
  const cookieSecret = configService.get('app.cookieSecret');
  app.use(cookieParser(cookieSecret));
  if (configService.get('app.mode') == 'development') {
    app.enableCors({
      origin: true,
      credentials: true,
    });
    console.log('CORS-enabled');
  }
  await app.listen(port, () =>
    console.log(
      `Сервер ${configService.get('app.mode')} запущен на ${port} порту.`,
    ),
  );
}
bootstrap();
