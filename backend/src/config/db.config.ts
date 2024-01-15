import { SequelizeModuleOptions } from '@nestjs/sequelize';

interface config {
  db: SequelizeModuleOptions;
}

export const dbConfig = () =>
  <config>{
    db: {
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [],
      autoLoadModels: true,
      synchronize: false,
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
    },
  };
