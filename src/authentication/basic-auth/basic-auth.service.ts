import { compare, hash } from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { UserBaseEntity } from '../models';
import { RequestTransaction } from '../../request-transaction';

@Injectable()
export class BasicAuthService {
  constructor(private readonly requestTransaction: RequestTransaction) {}

  public async hash(password: string): Promise<string> {
    return hash(password, 10);
  }

  public async verify(password: string, hashedPass: string): Promise<boolean> {
    return compare(password, hashedPass);
  }

  public async setUserPassword(currentUser: UserBaseEntity, newPassword: string) {
    currentUser.password = await this.hash(newPassword);
    currentUser.shouldChangePassword = false;
    const userRepo = this.requestTransaction.getRepository(UserBaseEntity);
    await userRepo.save(currentUser);
  }
}
