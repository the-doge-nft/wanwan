import { Meme } from '@prisma/client';
import {
  basePrismaFilterOps,
  numberPrismaFilterOps,
  stringPrismaFilterOps,
} from './competition-search.schema';
const Joi = require('joi');

export const memeSearchKeyNames: (keyof Meme)[] = [
  'id',
  'name',
  'description',
  'createdAt',
  'updatedAt',
  'createdById',
  'mediaId',
];

export const memeSearchSchema = Joi.object().keys({
  filters: Joi.array().items(
    Joi.object({
      key: Joi.string()
        .valid(...memeSearchKeyNames)
        .required(),
      value: Joi.any()
        .required()
        .when('key', {
          switch: [
            { is: 'id', then: Joi.number() },
            { is: 'maxUserSubmissions', then: Joi.number() },
          ],
          otherwise: Joi.string(),
        }),
      operation: Joi.string()
        .required()
        .when('value', {
          switch: [
            {
              is: Joi.date(),
              then: Joi.string().valid(...basePrismaFilterOps),
            },
            {
              is: Joi.string(),
              then: Joi.string().valid(...stringPrismaFilterOps),
            },
            {
              is: Joi.number(),
              then: Joi.string().valid(...numberPrismaFilterOps),
            },
          ],
        }),
    }),
  ),

  sorts: Joi.array().items(
    Joi.object({
      key: Joi.string()
        .valid(...memeSearchKeyNames)
        .required(),
      direction: Joi.string().valid('asc', 'desc').required(),
    }),
  ),
});
