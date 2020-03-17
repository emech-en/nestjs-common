import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, TableInheritance } from 'typeorm';
import { generate as generateRandomString } from 'randomstring';

@Entity('otp')
@TableInheritance({ column: { name: 'type', type: 'varchar' } })
export abstract class OtpAbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 6,
    update: false,
  })
  code: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @Column({ type: 'integer' })
  retryLeft: number;

  @Column({
    type: 'timestamp with time zone',
    update: false,
  })
  expiresAt: Date;

  @Column({
    type: 'timestamp with time zone',
    nullable: true,
  })
  usedAt?: Date;

  public isExpired() {
    if (this.usedAt != null) {
      return true;
    }
    if (new Date() > this.expiresAt) {
      return false;
    }
    return this.retryLeft < 1;
  }

  @BeforeInsert()
  private initiateOtpCode() {
    this.code = generateRandomString({
      length: 6,
      charset: 'numeric',
    });
    this.retryLeft = 3;
    this.expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  }
}
