import { compare, hash } from 'bcrypt';
import { HashProvider } from './hash.provider';

export class BcryptHashProvider extends HashProvider {
  hash(password: string): Promise<string> {
    return hash(password, 10);
  }

  verify(password: string, hashedPass: string): Promise<boolean> {
    return compare(password, hashedPass);
  }
}
