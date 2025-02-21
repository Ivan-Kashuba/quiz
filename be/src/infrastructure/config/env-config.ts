import { config } from 'dotenv';
import * as process from 'process';

config();

export enum EnvVariables {
  PORT = 'PORT',
  DB_NAME = 'DB_NAME',
  DATABASE_SSL = 'DATABASE_SSL',
  DB_PORT = 'DB_PORT',
  DB_USERNAME = 'DB_USERNAME',
  DB_PASSWORD = 'DB_PASSWORD',
  DB_HOST = 'DB_HOST',
  JWT_SECRET_KEY = 'JWT_SECRET_KEY',
  EMAIL_SENDER_PASSWORD = 'EMAIL_SENDER_PASSWORD',
  FRONT_END_URL = 'FRONT_END_URL',
  ADMIN_AUTH_HEADER = 'ADMIN_AUTH_HEADER',
  GOOGLE_CLIENT_ID = 'GOOGLE_CLIENT_ID',
  GOOGLE_SECRET = 'GOOGLE_SECRET',
}

export const envConfig = {
  [EnvVariables.PORT]: process.env.PORT || '8000',
  db: {
    [EnvVariables.DB_NAME]: process.env.DB_NAME || '',
    [EnvVariables.DATABASE_SSL]: process.env.DATABASE_SSL
      ? JSON.parse(process.env.DATABASE_SSL)
      : false,
    [EnvVariables.DB_PORT]: process.env.DB_PORT || '',
    [EnvVariables.DB_USERNAME]: process.env.DB_USERNAME || '',
    [EnvVariables.DB_PASSWORD]: process.env.DB_PASSWORD || '',
    [EnvVariables.DB_HOST]: process.env.DB_HOST || '',
  },
  [EnvVariables.JWT_SECRET_KEY]: process.env.JWT_SECRET_KEY || 'haval160',
  [EnvVariables.EMAIL_SENDER_PASSWORD]: process.env.EMAIL_SENDER_PASSWORD || '',
  [EnvVariables.FRONT_END_URL]:
    process.env.FRONT_END_URL || 'https://some-front.com',
  [EnvVariables.ADMIN_AUTH_HEADER]:
    process.env.ADMIN_AUTH_HEADER || 'Basic YWRtaW46cXdlcnR5',
  [EnvVariables.GOOGLE_CLIENT_ID]: process.env.GOOGLE_CLIENT_ID,
  [EnvVariables.GOOGLE_SECRET]: process.env.GOOGLE_SECRET,
};

export default () => envConfig;
