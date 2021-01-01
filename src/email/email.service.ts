import { Email } from './types';

export abstract class EmailService {
  abstract send(email: Email): Promise<void>;
}
