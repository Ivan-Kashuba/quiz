import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { envConfig, EnvVariables } from './env-config';

export class DbConfigService {
  static getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      database: envConfig.db[EnvVariables.DB_NAME],
      ssl: envConfig.db[EnvVariables.DATABASE_SSL]
        ? {
            rejectUnauthorized: false,
          }
        : false,
      host: envConfig.db[EnvVariables.DB_HOST],
      port: +envConfig.db[EnvVariables.DB_PORT],
      username: envConfig.db[EnvVariables.DB_USERNAME],
      password: envConfig.db[EnvVariables.DB_PASSWORD],
      autoLoadEntities: true,
      synchronize: true,
    };
  }
}
