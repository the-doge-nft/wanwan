import { Injectable } from '@nestjs/common';
import { Meme, Prisma, PrismaClient } from '@prisma/client';
import {
  memeSearchKeyNames,
  memeSearchSchema,
} from '../schema/meme-search.schema';
import { Search } from '../search/search';

@Injectable()
export class MemeSearchService extends Search<Meme, Prisma.MemeFindManyArgs> {
  keyNames = memeSearchKeyNames;
  guardedKeyNames = [];
  customKeyNames = [];
  modelName = 'meme' as keyof PrismaClient;
  validationSchema = memeSearchSchema;

  protected beforeGetAll(builder) {
    // builder.where('deletedAt', { equals: null });
  }

  onCustomKeyFilter() {
    return;
  }

  onCustomKeySort() {
    return;
  }
}
