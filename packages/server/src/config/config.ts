import * as Joi from 'joi';

export enum AppEnv {
  production = 'production',
  development = 'development',
  staging = 'staging',
  test = 'test',
}

export interface Config {
  port: number;
  appEnv: AppEnv;
  databaseUrl: string;
  aws: {
    region: string;
    accessKey: string;
    secretAccessKey: string;
    mediaBucketName: string;
  };
  session: {
    secret: string;
    name: string;
  };
  redisUrl: string;
  alchemy: {
    apiKey: string;
    wsEndpoint: string;
    httpEndpoint: string;
  };
  sentry: {
    dns: string;
  };
  twitter: {
    consumerKey: string;
    consumerSecret: string;
    accessToken: string;
    accessTokenSecret: string;
    clientId: string;
    clientSecret: string;
  };
  isDev: boolean;
  isProd: boolean;
  isStaging: boolean;
  baseUrl: string;
}

export const configSchema = Joi.object<Config>({
  port: Joi.number().integer().required(),
  appEnv: Joi.string()
    .valid(AppEnv.development, AppEnv.staging, AppEnv.test, AppEnv.production)
    .required(),
  databaseUrl: Joi.string().required(),
  aws: Joi.object({
    region: Joi.string().required(),
    accessKey: Joi.string().required(),
    secretAccessKey: Joi.string().required(),
    mediaBucketName: Joi.string().required(),
  }).required(),
  session: Joi.object({
    secret: Joi.string().required(),
    name: Joi.string().required(),
  }).required(),
  redisUrl: Joi.string().required(),
  alchemy: Joi.object({
    apiKey: Joi.string().required(),
    wsEndpoint: Joi.string().required(),
    httpEndpoint: Joi.string().required(),
  }).required(),
  sentry: Joi.object({
    dns: Joi.string().required(),
  }).required(),
  twitter: Joi.object({
    consumerKey: Joi.string().required(),
    consumerSecret: Joi.string().required(),
    accessToken: Joi.string().required(),
    accessTokenSecret: Joi.string().required(),
    clientId: Joi.string().required(),
    clientSecret: Joi.string().required(),
  }),
  isDev: Joi.boolean().required(),
  isProd: Joi.boolean().required(),
  isStaging: Joi.boolean().required(),
  baseUrl: Joi.string().required(),
});

// must return a getter here so process.env is not read at import time
export default (): Config => ({
  port: parseInt(process.env.PORT),
  appEnv: process.env.APP_ENV as AppEnv,
  databaseUrl: process.env.DATABASE_URL,
  aws: {
    region: process.env.AWS_REGION,
    accessKey: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    mediaBucketName: process.env.AWS_MEDIA_BUCKET_NAME,
  },
  session: {
    secret: process.env.SESSION_SECRET,
    name: process.env.SESSION_NAME,
  },
  redisUrl: process.env.REDIS_URL,
  alchemy: {
    apiKey: process.env.ALCHEMY_API_KEY,
    wsEndpoint: process.env.ALCHEMY_WS_ENDPOINT,
    httpEndpoint: process.env.ALCHEMY_HTTP_ENDPOINT,
  },
  sentry: {
    dns: process.env.SENTRY_DNS,
  },
  twitter: {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    clientId: process.env.TWITTER_CLIENT_ID,
    clientSecret: process.env.TWITTER_CLIENT_SECRET,
  },
  isDev: process.env.APP_ENV === AppEnv.development,
  isProd: process.env.APP_ENV === AppEnv.production,
  isStaging: process.env.APP_ENV === AppEnv.staging,
  baseUrl:
    process.env.APP_ENV === AppEnv.development
      ? 'http://localhost:3000'
      : process.env.APP_ENV === AppEnv.staging
      ? 'https://test.wanwan.me'
      : 'https://wanwan.me',
});
