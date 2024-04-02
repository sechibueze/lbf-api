import { DataSourceOptions, DataSource } from 'typeorm';
import { appConfig } from '../constants/app.constant';

const dbConfig: DataSourceOptions = {
  type: 'postgres',
  url: appConfig.DATABASE_URI,
  entities: [],
  synchronize: process.env.NODE_ENV !== 'production',
};

export const AppDataSource = new DataSource(dbConfig);
