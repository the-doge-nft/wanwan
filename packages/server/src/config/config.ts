export enum AppEnv {
  development = 'development',
  staging = 'staging',
  test = 'test',
}

interface Configuration {
  port: number;
  appEnv: AppEnv;
}

const configuration: Configuration = {
  port: parseInt(process.env.PORT) || 3000,
  appEnv: (process.env.APP_ENV as AppEnv) || AppEnv.development,
};

export default configuration;
