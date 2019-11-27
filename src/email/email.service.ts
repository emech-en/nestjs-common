import { Email } from './types';

export abstract class EmailService {
  abstract async send(email: Email): Promise<void>;
}
