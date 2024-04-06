import { DataSourceOptions, DataSource } from 'typeorm';
import { appConfig } from '../constants/app.constant';
import { User } from '../entities/user.entity';
import { Business } from '../entities/business.entity';

const dbConfig: DataSourceOptions = {
  type: 'postgres',
  url: appConfig.DATABASE_URI,
  entities: [User, Business],
  synchronize: process.env.NODE_ENV !== 'production',
};

export const AppDataSource = new DataSource(dbConfig);
