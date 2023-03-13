import { Injectable } from '@nestjs/common';
import { Meme, Prisma, PrismaClient } from '@prisma/client';
import { MemeWithDefaultInclude } from 'src/interface';
import QueryBuilder from 'src/search/query-builder';
import {
  memeCustomKeyNames,
  memeSearchKeyNames,
  memeSearchSchema,
} from '../schema/meme-search.schema';
import { Search } from '../search/search';
import { MemeService } from './meme.service';

@Injectable()
export class MemeSearchService extends Search<Meme, Prisma.MemeFindManyArgs> {
  keyNames = memeSearchKeyNames;
  guardedKeyNames = [];
  customKeyNames = memeCustomKeyNames;
  modelName = 'meme' as keyof PrismaClient;
  validationSchema = memeSearchSchema;

  constructor(private readonly meme: MemeService) {
    super();
  }

  protected beforeGetAll(builder) {
    builder.where('deletedAt', { equals: null });
    builder.include('user', true);
    builder.include('media', true);
  }

  onCustomKeyFilter(
    filter,
    builder: QueryBuilder<Meme, Prisma.MemeFindManyArgs>,
  ) {
    if (filter.key === 'address') {
      builder.where('user', { address: { equals: filter.value } });
    }
    return;
  }

  onCustomKeySort() {
    return;
  }

  async afterGetAll(results: Array<MemeWithDefaultInclude>) {
    const res = await this.meme.addExtras(results);
    return res;
  }
}
