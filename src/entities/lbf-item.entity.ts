import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { User } from './user.entity';

interface ClaimerType {
  full_name: string;
  email: string;
  phone_number: string;
}
@Entity({ name: 'lbf-items' })
export class LBFItem extends AppBaseEntity {
  @ManyToOne(() => User, (user) => user.lbf_items)
  owner: User;

  @Index()
  @Column({ type: 'boolean', default: false })
  is_claimed: boolean;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  token: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 255 })
  pickup_point: string;

  @Column({ type: 'varchar' })
  image: string;

  @Column({ type: 'varchar', default: '' })
  tags: string;

  @Column({ type: 'json', nullable: true })
  claimer: ClaimerType;
}
