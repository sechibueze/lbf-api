import { Entity, Column, OneToMany, Index } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { Product } from './product.entity';

@Entity({ name: 'segments' })
export class Segment extends AppBaseEntity {
  @OneToMany(() => Product, (product) => product.segment)
  products: Product[];

  @Column({ type: 'varchar', length: 255, unique: true })
  @Index()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 255 })
  image: string;
}
