import { MigrationInterface, QueryRunner } from 'typeorm';

export class FirstMigration1607769812611 implements MigrationInterface {
  name = 'FirstMigration1607769812611';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "version" integer NOT NULL, "username" character varying, "email" character varying, "phone" character varying, "facebookId" character varying, "xingId" character varying, "googleId" character varying, "password" character varying, "shouldChangePassword" boolean, "isBanned" boolean NOT NULL DEFAULT false, "userType" character varying NOT NULL, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_8e1f623798118e629b46a9e6299" UNIQUE ("phone"), CONSTRAINT "UQ_7989eba4dafdd5322761765f2b8" UNIQUE ("facebookId"), CONSTRAINT "UQ_32ed388e8a2e52a35302ea2601f" UNIQUE ("xingId"), CONSTRAINT "UQ_470355432cc67b2c470c30bef7c" UNIQUE ("googleId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(`CREATE INDEX "IDX_03bb2f4ae327fc5257d9d677b7" ON "user" ("userType") `, undefined);
    await queryRunner.query(
      `CREATE TABLE "accessToken" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "isLoggedOut" boolean NOT NULL DEFAULT false, "userId" integer, CONSTRAINT "PK_8be7e6be2e3607bb0a5bd0bdf63" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "accessToken" ADD CONSTRAINT "FK_c4c5b44c5f6b300fb367a12dade" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "accessToken" DROP CONSTRAINT "FK_c4c5b44c5f6b300fb367a12dade"`, undefined);
    await queryRunner.query(`DROP TABLE "accessToken"`, undefined);
    await queryRunner.query(`DROP INDEX "IDX_03bb2f4ae327fc5257d9d677b7"`, undefined);
    await queryRunner.query(`DROP TABLE "user"`, undefined);
  }
}
