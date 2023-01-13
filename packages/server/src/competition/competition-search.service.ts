import { Injectable } from '@nestjs/common';
import { Competition, Prisma, PrismaClient } from '@prisma/client';
import {
  competitionSearchKeyNames,
  competitionSearchSchema,
} from 'src/schema/competition-search.schema';
import { Search } from 'src/search/search';

@Injectable()
export class CompetitionSearchService extends Search<
  Competition,
  Prisma.CompetitionFindManyArgs
> {
  keyNames = competitionSearchKeyNames;
  guardedKeyNames = ['deletedAt'];
  customKeyNames = [];
  modelName = 'competition' as keyof PrismaClient;
  validationSchema = competitionSearchSchema;

  protected beforeGetAll(builder) {
    builder.where('deletedAt', { equals: null });
  }

  onCustomKeyFilter() {
    return;
  }

  onCustomKeySort() {
    return;
  }
}
