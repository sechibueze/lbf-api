import { Entity, Column, OneToMany } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { LBFItem } from './lbf-item.entity';

@Entity({ name: 'users' })
export class User extends AppBaseEntity {
  @OneToMany(() => LBFItem, (lbf) => lbf.owner)
  lbf_items: LBFItem[];

  @Column({ type: 'varchar', length: 255, nullable: false })
  full_name: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: false, select: false })
  password: string;

  @Column({ type: 'varchar', length: 100, nullable: true, select: false })
  email_confirm_token_hash: string;

  @Column({ type: 'varchar', length: 100, nullable: true, select: false })
  password_reset_token_hash: string;

  @Column({ type: 'bool', default: false })
  is_verified_email: boolean;

  @Column({ type: 'enum', enum: ['admin'], default: 'admin' })
  role: string;

  @Column({ type: 'varchar', length: 100, nullable: true, default: '' })
  avatar: string;
}
