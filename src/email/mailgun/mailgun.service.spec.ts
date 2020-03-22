import { Test } from '@nestjs/testing';
import { MailgunService } from './mailgun.service';
import { MailgunConfig } from './mailgun.config';

describe('EmailService', () => {
  let service: MailgunService;

  beforeEach(async () => {
    const testModule = await Test.createTestingModule({
      providers: [
        MailgunService,
        {
          provide: MailgunConfig,
          useValue: {
            apiKey: 'SOME_API_KEY',
            defaults: {
              fromDomain: 'SOME_DOMAIN',
            },
            domain: 'SOME_DOMAIN',
          } as MailgunConfig,
        },
      ],
    })
      .compile()
      .then((m) => m.createNestApplication());

    service = testModule.get<MailgunService>(MailgunService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
