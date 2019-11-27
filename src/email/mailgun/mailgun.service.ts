import { Inject, Injectable, Logger } from '@nestjs/common';
import { EmailService } from '../email.service';
import MailGun, { Mailgun } from 'mailgun-js';
import { MailgunConfig } from './mailgun.config';
import { Email } from '../types';

@Injectable()
export class MailgunService extends EmailService {
  private mailgunInstance: Mailgun;

  constructor(
    @Inject(MailgunConfig) private readonly config: MailgunConfig,
    private readonly logger: Logger,
  ) {
    super();
    this.mailgunInstance = new MailGun(config);
  }

  async send(email: Email): Promise<void> {
    const result = await this.mailgunInstance.messages().send({
      from: email.from,
      to: email.to,
      subject: email.subject,
      html: email.html,
    });
    this.logger.debug(`Email sent to ${email.to}: ${JSON.stringify(result)}`);
  }
}
