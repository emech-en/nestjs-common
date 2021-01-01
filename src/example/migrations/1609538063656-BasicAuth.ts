import { MigrationInterface, QueryRunner } from 'typeorm';

export class BasicAuth1609538063656 implements MigrationInterface {
  name = 'BasicAuth1609538063656';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "emailVerified" TIMESTAMP WITH TIME ZONE`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "emailVerified"`, undefined);
  }
}
