import { Entity, Column } from 'typeorm';
import { AppBaseEntity } from './base.entity';

@Entity({ name: 'users' })
export class User extends AppBaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  full_name: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: false, select: false })
  password: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email_confirm_token_hash: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  password_reset_token_hash: string;

  @Column({ type: 'bool', default: false })
  is_verified_email: boolean;

  @Column({ type: 'enum', enum: ['i', 'r', 'w'], default: 'w' })
  membership_type: string;

  @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
  role: string;

  @Column({ type: 'varchar', length: 100, nullable: true, default: '' })
  avatar: string;
}
