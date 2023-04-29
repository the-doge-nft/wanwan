import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CompetitionVotingRuleService {
  constructor(private readonly prisma: PrismaService) {}
  upsert(args: Prisma.CompetitionVotingRuleUpsertArgs) {
    return this.prisma.competitionVotingRule.upsert(args);
  }
  create(args: Prisma.CompetitionVotingRuleCreateArgs) {
    return this.prisma.competitionVotingRule.create(args);
  }
}
