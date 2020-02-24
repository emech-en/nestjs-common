import { RegisterService, RegisterType } from './register.service';
import { UserBaseEntity } from '../models';
import { Injectable } from '@nestjs/common';
import { RequestTransaction } from '../../request-transaction';

@Injectable()
export class RegisterBaseService extends RegisterService {
  constructor(private readonly requestTransaction: RequestTransaction) {
    super();
  }

  async register(
    data: Partial<UserBaseEntity>,
    registerType: RegisterType,
    registerData?: any,
  ): Promise<UserBaseEntity> {
    return await this.requestTransaction.getEntityManager().save(new UserBaseEntity(data));
  }
}
