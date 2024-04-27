import { DataSourceOptions, DataSource } from 'typeorm';
import { appConfig } from '../constants/app.constant';
import { User } from '../entities/user.entity';

import { LBFItem } from '../entities/lbf-item.entity';

const dbConfig: DataSourceOptions = {
  type: 'postgres',
  url: appConfig.DATABASE_URI,
  entities: [User, LBFItem],
  synchronize: process.env.NODE_ENV !== 'production',
};

export const AppDataSource = new DataSource(dbConfig);
