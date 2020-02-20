import { Test } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthenticationService } from './authentication.service';
import { AccessTokenEntity } from './models';
import { Repository } from 'typeorm';

describe('Authentication Controller', () => {
  let controller: AuthenticationController;

  beforeEach(async () => {
    const testModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        {
          provide: getRepositoryToken(AccessTokenEntity),
          useClass: Repository,
        },
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
