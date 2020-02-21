import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AccountEntity } from './account.entity';

@Entity('accessToken')
export class AccessTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  updatedAt: Date;

  @Column({
    type: 'timestamp without time zone',
    update: false,
  })
  expiresAt: Date;

  @Column({
    type: 'boolean',
    default: false,
  })
  isLoggedOut: boolean;

  @ManyToOne(() => AccountEntity)
  account: AccountEntity;

  public isExpired() {
    return this.isLoggedOut || new Date() > this.expiresAt;
  }
}
