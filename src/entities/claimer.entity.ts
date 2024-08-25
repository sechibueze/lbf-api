import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { LBFItem } from './lbf-item.entity';

@Entity({ name: 'claimers' })
export class Claimer extends AppBaseEntity {
  @Column({ type: 'varchar', length: 255 })
  full_name: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 20 })
  phone_number: string;

  @OneToOne(() => LBFItem, (item) => item.claimer, { onDelete: 'CASCADE' })
  @JoinColumn()
  lbf_item: LBFItem;
}
