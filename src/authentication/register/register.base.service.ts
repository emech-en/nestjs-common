import { RegisterService, RegisterType } from './register.service';
import { UserBaseEntity } from '../models';
import { Inject } from '@nestjs/common';
import { RequestTransaction } from '../../request-transaction';

export class SimpleRegisterService extends RegisterService {
  constructor(@Inject(RequestTransaction) private readonly requestTransaction: RequestTransaction) {
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
