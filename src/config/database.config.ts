import { DataSourceOptions, DataSource } from 'typeorm';
import { appConfig } from '../constants/app.constant';
import { User } from '../entities/user.entity';
import { Venture } from '../entities/venture.entity';
import { Segment } from '../entities/segment.entity';
import { Product } from '../entities/product.entity';

const dbConfig: DataSourceOptions = {
  type: 'postgres',
  url: appConfig.DATABASE_URI,
  entities: [User, Venture, Segment, Product],
  synchronize: process.env.NODE_ENV !== 'production',
};

export const AppDataSource = new DataSource(dbConfig);
