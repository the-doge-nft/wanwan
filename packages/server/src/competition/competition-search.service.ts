import { Injectable } from '@nestjs/common';
import { Competition, Prisma, PrismaClient } from '@prisma/client';
import {
  competitionSearchKeyNames,
  competitionSearchSchema,
} from 'src/schema/competition-search.schema';
import { Search } from 'src/search/search';
import { competitionSearchCustomKeys } from './../schema/competition-search.schema';

@Injectable()
export class CompetitionSearchService extends Search<
  Competition,
  Prisma.CompetitionFindManyArgs
> {
  keyNames = competitionSearchKeyNames;
  guardedKeyNames = [];
  customKeyNames = competitionSearchCustomKeys;
  modelName = 'competition' as keyof PrismaClient;
  validationSchema = competitionSearchSchema;

  protected beforeGetAll(builder) {
    // builder.where('deletedAt', { equals: null });
  }

  onCustomKeyFilter(filter, builder) {
    if (filter.key === 'address') {
      return builder.where('user', {
        address: { [filter.operation]: filter.value },
      });
    }
    return;
  }

  onCustomKeySort() {
    return;
  }
}
