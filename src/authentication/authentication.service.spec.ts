import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AccessTokenEntity } from './models';
import { Repository } from 'typeorm';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let accessTokenRepo: Repository<AccessTokenEntity>;

  beforeEach(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        {
          provide: getRepositoryToken(AccessTokenEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    const testApp = testModule.createNestApplication();

    service = testApp.get(AuthenticationService);
    accessTokenRepo = testApp.get<Repository<AccessTokenEntity>>(
      getRepositoryToken(AccessTokenEntity),
    );
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('AuthenticationService.logout', () => {
    it('Should do nothing if token is invalid or expired', async () => {
      const repoMock = jest
        .spyOn(accessTokenRepo, 'findOne')
        .mockResolvedValue(undefined);
      await service.logout('INVALID_TOKEN');
      expect(repoMock).toBeCalledWith('INVALID_TOKEN');
    });
  });

  // describe('AuthenticationService.register', () => {
  //   it('Should throw error when username and email is undefined', async () => {
  //     await expect(service.register({})).rejects.toThrow(BadRequestException);
  //   });
  //
  //   it('Should create a user with default password', async () => {
  //     const expectedResult = new AccessTokenEntity();
  //     const accountToBeCreate = new AccessTokenEntity();
  //     accountToBeCreate.username = 'testUser';
  //     accountToBeCreate.password = '1234';
  //     accountToBeCreate.email = undefined;
  //     accountToBeCreate.shouldChangePassword = true;
  //     accountToBeCreate.domainData = undefined;
  //
  //     const hashMock = jest
  //       .spyOn(hashProvider, 'hash')
  //       .mockResolvedValueOnce('1234');
  //     const repositoryMock = jest
  //       .spyOn(accessTokenEntity, 'save')
  //       .mockResolvedValueOnce(expectedResult);
  //
  //     const result = await service.register({
  //       username: 'testUser',
  //     });
  //     expect(hashMock).toHaveBeenCalledWith('123');
  //     expect(repositoryMock).toBeCalledWith(accountToBeCreate, {
  //       data: {
  //         registerType: RegisterType.AuthenticationService,
  //       },
  //     });
  //     expect(result).toBe(expectedResult);
  //   });
  // });
});
