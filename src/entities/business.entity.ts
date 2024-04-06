import { Entity, Column, ManyToOne } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity({ name: 'business' })
export class Business extends AppBaseEntity {
  @ManyToOne(() => User, (user) => user.ventures, { onDelete: 'CASCADE' })
  owner: User;

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

  @Column({ type: 'enum', enum: ['r', 'w'], default: 'w' })
  type: string;
}
