import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CompetitionVotingRuleService {
  get defaultInclude() {
    return {
      currency: true,
    };
  }

  constructor(private readonly prisma: PrismaService) {}
  upsert(args: Prisma.CompetitionVotingRuleUpsertArgs) {
    return this.prisma.competitionVotingRule.upsert(args);
  }
  create(args: Prisma.CompetitionVotingRuleCreateArgs) {
    return this.prisma.competitionVotingRule.create(args);
  }
  findFirst(args: Prisma.CompetitionVotingRuleFindFirstArgs) {
    return this.prisma.competitionVotingRule.findFirst({
      ...args,
      include: {
        ...args.include,
        ...this.defaultInclude,
      },
    });
  }
  findMany(args: Prisma.CompetitionVotingRuleFindManyArgs) {
    return this.prisma.competitionVotingRule.findMany({
      ...args,
      include: {
        ...args.include,
        ...this.defaultInclude,
      },
    });
  }
}
