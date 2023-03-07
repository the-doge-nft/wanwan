import { Injectable } from '@nestjs/common';
import { Competition, Prisma, PrismaClient } from '@prisma/client';
import {
  competitionSearchKeyNames,
  competitionSearchSchema,
} from 'src/schema/competition-search.schema';
import { Search } from 'src/search/search';
import QueryBuilder from '../search/query-builder';
import { competitionSearchCustomKeys } from './../schema/competition-search.schema';
import { CompetitionService } from './competition.service';

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

  constructor(private readonly competition: CompetitionService) {
    super();
  }

  protected beforeGetAll(
    builder: QueryBuilder<Competition, Prisma.CompetitionFindManyArgs>,
  ) {
    builder.include('curators', { include: { user: true } });
    builder.include('rewards', { include: { currency: true } });
    builder.include('user', true);
    builder.include('submissions', {
      where: { deletedAt: null },
      include: { meme: { include: { media: true } } },
      orderBy: { createdAt: 'asc' },
      take: 1,
    });
  }

  onCustomKeyFilter(filter, builder) {
    if (filter.key === 'address') {
      return builder.where('user', {
        address: { [filter.operation]: filter.value },
      });
    } else if (filter.key === 'isActive') {
      let operation = 'lt';
      if (filter.value) {
        operation = 'gt';
      }
      return builder.where('endsAt', { [operation]: new Date() });
    }
  }

  afterGetAll(results) {
    return this.competition.addExtras(results);
  }

  onCustomKeySort() {
    return;
  }
}
