import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserBaseEntity } from './user.base.entity';

@Entity('accessToken')
export class AccessTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @Column({
    type: 'timestamp with time zone',
    update: false,
  })
  expiresAt: Date;

  @Column({
    type: 'boolean',
    default: false,
  })
  isLoggedOut: boolean;

  @ManyToOne(() => UserBaseEntity)
  user: UserBaseEntity;

  public isExpired() {
    return this.isLoggedOut || new Date() > this.expiresAt;
  }
}
