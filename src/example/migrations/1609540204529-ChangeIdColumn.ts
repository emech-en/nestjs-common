import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeIdColumn1609540204529 implements MigrationInterface {
  name = 'ChangeIdColumn1609540204529';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "accessToken" DROP CONSTRAINT "FK_c4c5b44c5f6b300fb367a12dade"`, undefined);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`, undefined);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`, undefined);
    await queryRunner.query(`ALTER TABLE "user" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`, undefined);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`,
      undefined,
    );
    await queryRunner.query(`ALTER TABLE "accessToken" DROP COLUMN "userId"`, undefined);
    await queryRunner.query(`ALTER TABLE "accessToken" ADD "userId" uuid`, undefined);
    await queryRunner.query(
      `ALTER TABLE "accessToken" ADD CONSTRAINT "FK_c4c5b44c5f6b300fb367a12dade" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "accessToken" DROP CONSTRAINT "FK_c4c5b44c5f6b300fb367a12dade"`, undefined);
    await queryRunner.query(`ALTER TABLE "accessToken" DROP COLUMN "userId"`, undefined);
    await queryRunner.query(`ALTER TABLE "accessToken" ADD "userId" integer`, undefined);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`, undefined);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`, undefined);
    await queryRunner.query(`ALTER TABLE "user" ADD "id" SERIAL NOT NULL`, undefined);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "accessToken" ADD CONSTRAINT "FK_c4c5b44c5f6b300fb367a12dade" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
  }
}
