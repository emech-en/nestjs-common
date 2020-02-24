import { Test } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

describe('Authentication Controller', () => {
  let controller: AuthenticationController;

  beforeEach(async () => {
    const testModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthenticationService,
          useValue: {},
        },
      ],
      controllers: [AuthenticationController],
    }).compile();

    controller = testModule.get<AuthenticationController>(AuthenticationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
