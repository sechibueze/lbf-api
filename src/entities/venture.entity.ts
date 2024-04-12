import { Entity, Column, ManyToOne } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { User } from './user.entity';
import { SUPPORTED_VENTURE_TYPES } from '../schema/venture.schema';
import { Product } from './product.entity';

@Entity({ name: 'ventures' })
export class Venture extends AppBaseEntity {
  @ManyToOne(() => User, (user) => user.ventures, { onDelete: 'CASCADE' })
  owner: User;

  @ManyToOne(() => Product, (product) => product.venture)
  products: Product[];

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  phone: string;

  @Column({ type: 'varchar', length: 100 })
  tax_id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  logo: string;

  @Column({ type: 'varchar', length: 100 })
  street: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;
  @Column({ type: 'varchar', length: 100 })
  state: string;
  @Column({ type: 'varchar', length: 100 })
  country: string;

  @Column({ type: 'bool', default: false })
  is_verified: boolean;

  @Column({
    type: 'enum',
    enum: SUPPORTED_VENTURE_TYPES,
    default: SUPPORTED_VENTURE_TYPES[0],
  })
  type: string;
}
