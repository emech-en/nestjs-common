import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppInfoProvider } from './app.info';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [AppInfoProvider],
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "This is Vyme Restful API!"', () => {
      expect(appController.getHello()).toBe('This is Vyme Restful API! This is a Change!');
    });
  });
});
