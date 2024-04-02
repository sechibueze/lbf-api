import { DataSourceOptions } from 'typeorm';
import { appConfig } from '../constants/app.constant';

export const dbConfig: DataSourceOptions = {
  type: 'postgres',
  url: appConfig.DATABASE_URI,
  entities: [],
  synchronize: process.env.NODE_ENV !== 'production',
  ssl: {
    rejectUnauthorized: false,
  },
};
