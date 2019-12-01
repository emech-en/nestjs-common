import { Test } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import {
  BcryptHashProvider,
  HashProvider,
  LoginProvider,
  PasswordLoginProvider,
  SimpleTokenProvider,
  TokenProvider,
} from './providers';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AccessTokenEntity, AccountEntity, OtpEmailCodeEntity } from './models';
import { Repository } from 'typeorm';
import { EmailService, MailgunService } from '../email';

describe('Authentication Controller', () => {
  let controller: AuthenticationController;

  beforeEach(async () => {
    const testModule = await Test.createTestingModule({
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
        {
          provide: getRepositoryToken(OtpEmailCodeEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(AccessTokenEntity),
          useClass: Repository,
        },
        {
          provide: EmailService,
          useFactory: () => {
            return new MailgunService({
              domain: 'SOME_DOMAIN',
              apiKey: 'SOME_KEY',
              defaults: {
                fromDomain: 'SOME_DOMAIN',
              },
            });
          },
        },
        {
          provide: TokenProvider,
          useClass: SimpleTokenProvider,
        },
        {
          provide: LoginProvider,
          useFactory: arg => [arg],
          inject: [PasswordLoginProvider],
        },
        PasswordLoginProvider,
      ],
      controllers: [AuthenticationController],
    }).compile();

    controller = testModule.get<AuthenticationController>(
      AuthenticationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
