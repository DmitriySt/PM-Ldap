import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServeStaticModule } from '@nestjs/serve-static';
import { jwtConfig } from 'config/jwt.config';
import { ldapConfig } from 'config/ldap.config';
import { AuthModule } from 'modules/auth/auth.module';
import { RolesModule } from 'modules/roles/roles.module';
import { UsersModule } from 'modules/users/users.module';
import * as path from 'path';
import { appConfig } from 'config/app.config';
import { dbConfig } from 'config/db.config';
import { ScheduleModule } from '@nestjs/schedule';
import { PasswordsModule } from 'modules/passwords/passswords.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
      load: [appConfig, dbConfig, jwtConfig, ldapConfig],
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        configService.get('db'),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    PasswordsModule,
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
