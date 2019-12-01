import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from './models';
import { AccountRegisterData, RegisterRequest, RegisterType } from './types';
import { HashProvider } from './providers';

const DEFAULT_PASSWORD = '123';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    private readonly hashProvider: HashProvider,
  ) {}

  async register(data: RegisterRequest): Promise<AccountEntity> {
    if (!data.email && !data.username) {
      throw new BadRequestException('[username] or [email] is required');
    }

    const accountEntity = new AccountEntity();
    accountEntity.email = data.email;
    accountEntity.username = data.username;
    accountEntity.password = await this.hashProvider.hash(DEFAULT_PASSWORD);
    accountEntity.shouldChangePassword = true;
    accountEntity.domainData = data.domainData;
    return await this.accountRepository.save(accountEntity, {
      data: {
        registerType: RegisterType.AuthenticationService,
      } as AccountRegisterData,
    });
  }

  async resetPassword(id: number) {
    await this.accountRepository.update(
      { id },
      {
        password: await this.hashProvider.hash(DEFAULT_PASSWORD),
        shouldChangePassword: true,
      },
    );
  }
}
