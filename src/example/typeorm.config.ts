import { ConnectionOptions } from 'typeorm';
import { AccessTokenEntity, UserBaseEntity } from '../authentication';

const options: ConnectionOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '', 10) || 5432,
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'mysecretpassword',
  database: process.env.POSTGRES_DB || 'nestjs-common-example',
  entities: [UserBaseEntity, AccessTokenEntity],

  synchronize: false,
  migrationsRun: true,
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/example/migrations',
  },
};

module.exports = options;
