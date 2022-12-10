import * as Joi from 'joi';

export enum AppEnv {
  development = 'development',
  staging = 'staging',
  test = 'test',
}

export interface Config {
  port: number;
  appEnv: AppEnv;
  session: {
    secret: string;
    name: string;
  };
  redis: {
    host: string;
    port: number;
    password: string;
  };
}

const configSchema = Joi.object<Config>({
  port: Joi.number().integer().required(),
  appEnv: Joi.string()
    .valid(AppEnv.development, AppEnv.staging, AppEnv.test)
    .required(),
  session: Joi.object({
    secret: Joi.string().required(),
    name: Joi.string().required(),
  }).required(),
  redis: Joi.object({
    host: Joi.string().required(),
    port: Joi.number().required(),
    password: Joi.string().required(),
  }).required(),
});

const config: Config = {
  port: parseInt(process.env.PORT) || 3000,
  appEnv: (process.env.APP_ENV as AppEnv) || AppEnv.development,
  session: {
    secret: process.env.SESSION_SECRET,
    name: process.env.SESSION_NAME,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
  },
};

class MissingEnvVarError extends Error {}

const { error } = configSchema.validate(config);
if (error) {
  throw new MissingEnvVarError(error.message);
}

export default config;
