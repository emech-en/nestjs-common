import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AccountEntity } from './models';
import { Repository } from 'typeorm';
import { BcryptHashProvider, HashProvider } from './providers';
import { BadRequestException } from '@nestjs/common';
import { RegisterType } from './types';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let hashProvider: HashProvider;
  let accountEntityRepository: Repository<AccountEntity>;

  beforeEach(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        {
          provide: HashProvider,
          useClass: BcryptHashProvider,
        },
        {
          provide: getRepositoryToken(AccountEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    const testApp = testModule.createNestApplication();

    service = testApp.get(AuthenticationService);
    hashProvider = testApp.get(HashProvider);
    accountEntityRepository = testApp.get<Repository<AccountEntity>>(
      getRepositoryToken(AccountEntity),
    );
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('AuthenticationService.register', () => {
    it('Should throw error when username and email is undefined', async () => {
      await expect(service.register({})).rejects.toThrow(BadRequestException);
    });
  });

  describe('AuthenticationService.register', () => {
    it('Should throw error when username and email is undefined', async () => {
      await expect(service.register({})).rejects.toThrow(BadRequestException);
    });

    it('Should create a user with default password', async () => {
      const expectedResult = new AccountEntity();
      const accountToBeCreate = new AccountEntity();
      accountToBeCreate.username = 'testUser';
      accountToBeCreate.password = '1234';
      accountToBeCreate.email = undefined;
      accountToBeCreate.shouldChangePassword = true;
      accountToBeCreate.domainData = undefined;

      const hashMock = jest
        .spyOn(hashProvider, 'hash')
        .mockResolvedValueOnce('1234');
      const repositoryMock = jest
        .spyOn(accountEntityRepository, 'save')
        .mockResolvedValueOnce(expectedResult);

      const result = await service.register({
        username: 'testUser',
      });
      expect(hashMock).toHaveBeenCalledWith('123');
      expect(repositoryMock).toBeCalledWith(accountToBeCreate, {
        data: {
          registerType: RegisterType.AuthenticationService,
        },
      });
      expect(result).toBe(expectedResult);
    });
  });
});
