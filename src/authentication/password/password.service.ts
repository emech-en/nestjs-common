import { compare, hash } from 'bcrypt';

export class PasswordService {
  public async hash(password: string): Promise<string> {
    return hash(password, 10);
  }

  public async verify(password: string, hashedPass: string): Promise<boolean> {
    return compare(password, hashedPass);
  }
}
