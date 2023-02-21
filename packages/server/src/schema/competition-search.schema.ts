import { Competition } from '@prisma/client';
import * as Joi from 'joi';

export const basePrismaFilterOps = ['equals', 'lt', 'lte', 'gt', 'gte'];
export const stringPrismaFilterOps = [
  ...basePrismaFilterOps,
  'in',
  'notIn',
  'contains',
  'startsWith',
  'endsWith',
  'not',
];
export const numberPrismaFilterOps = [
  ...basePrismaFilterOps,
  'in',
  'notIn',
  'not',
];

export const competitionSearchKeyNames: (keyof Competition)[] = [
  'id',
  'name',
  'description',
  'maxUserSubmissions',
  'endsAt',
  'createdAt',
  'updatedAt',
];

export const competitionSearchCustomKeys = ['address', 'isActive'];

export const competitionSearchSchema = Joi.object().keys({
  filters: Joi.array().items(
    Joi.object({
      key: Joi.string()
        .valid(...competitionSearchKeyNames, ...competitionSearchCustomKeys)
        .required(),
      value: Joi.any()
        .required()
        .when('key', {
          switch: [
            { is: 'id', then: Joi.number() },
            { is: 'maxUserSubmissions', then: Joi.number() },
            { is: 'isActive', then: Joi.boolean() },
          ],
          otherwise: Joi.string(),
        }),
      operation: Joi.string()
        .required()
        // @next -- these rules should be abstracted
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
            {
              is: Joi.boolean(),
              then: Joi.string().valid('equals'),
            },
          ],
        }),
    }),
  ),

  sorts: Joi.array().items(
    Joi.object({
      key: Joi.string()
        .valid(...competitionSearchKeyNames, ...competitionSearchCustomKeys)
        .required(),
      direction: Joi.string().valid('asc', 'desc').required(),
    }),
  ),
});
