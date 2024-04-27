import { Entity, Column, ManyToOne } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { Segment } from './segment.entity';
import { Venture } from './venture.entity';
import { User } from './user.entity';

@Entity({ name: 'products' })
export class Product extends AppBaseEntity {
  @ManyToOne(() => Venture, (venture) => venture.products)
  venture: Venture;

  @ManyToOne(() => Segment, (segment) => segment.products)
  segment: Segment;

  @ManyToOne(() => User, (user) => user.products)
  owner: User;

  @Column({ type: 'varchar', length: 255 })
  name: string;
  @Column({ type: 'float' })
  amount: number;
  @Column({ type: 'varchar', length: 255 })
  unit: string;
  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar' })
  image: string;
  @Column({ type: 'varchar' })
  tags: string;
}
