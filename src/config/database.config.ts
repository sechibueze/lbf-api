import { DataSourceOptions, DataSource } from 'typeorm';
import { appConfig } from '../constants/app.constant';
import { User } from '../entities/user.entity';

import { LBFItem } from '../entities/lbf-item.entity';
import { Claimer } from '../entities/claimer.entity';

const dbConfig: DataSourceOptions = {
  type: 'postgres',
  url: appConfig.DATABASE_URI,
  entities: [User, LBFItem, Claimer],
  synchronize: process.env.NODE_ENV !== 'production',
};

export const AppDataSource = new DataSource(dbConfig);
