export abstract class HashProvider {
  public abstract hash(password: string): Promise<string>;

  public abstract verify(password: string, hash: string): Promise<boolean>;
}
