export enum AppEnv {
  development = 'development',
  staging = 'staging',
  test = 'test',
}

export interface Configuration {
  port: number;
  appEnv: AppEnv;
  redis: {
    host: string;
    port: number;
    password: string;
  };
}

const configuration: Configuration = {
  port: parseInt(process.env.PORT) || 3000,
  appEnv: (process.env.APP_ENV as AppEnv) || AppEnv.development,
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
  },
};

export default configuration;
