import { Entity, Column, ManyToOne } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { Segment } from './segment.entity';
import { Venture } from './venture.entity';

@Entity({ name: 'products' })
export class Product extends AppBaseEntity {
  @ManyToOne(() => Venture, (venture) => venture.products)
  venture: Venture;

  @ManyToOne(() => Segment, (segment) => segment.products)
  segment: Segment;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar' })
  image: string;
}
