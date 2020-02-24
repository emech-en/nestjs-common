import { Injectable, Logger, Optional } from '@nestjs/common';
import { EmailService } from '../email.service';
import MailGun, { Mailgun } from 'mailgun-js';
import { MailgunConfig } from './mailgun.config';
import { Email } from '../types';

@Injectable()
export class MailgunService extends EmailService {
  private mailgunInstance: Mailgun;

  constructor(
    private readonly config: MailgunConfig,
    @Optional()
    private readonly logger: Logger = new Logger('MailgunService'),
  ) {
    super();
    this.mailgunInstance = new MailGun(config);
  }

  async send(email: Email): Promise<void> {
    const result = await this.mailgunInstance.messages().send({
      from: email.from ?? this.config.defaults.fromDomain,
      to: email.to,
      subject: email.subject,
      html: email.html,
    });
    this.logger.verbose(`Email sent to ${email.to}: ${JSON.stringify(result)}`);
  }
}
