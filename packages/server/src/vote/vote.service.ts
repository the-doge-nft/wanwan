import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from './../prisma.service';

@Injectable()
export class VoteService {
  constructor(private readonly prisma: PrismaService) {}

  create(args: Prisma.VoteCreateArgs) {
    return this.prisma.vote.create(args);
  }

  upsert(args: Prisma.VoteUpsertArgs) {
    return this.prisma.vote.upsert(args);
  }

  vote({
    createdById,
    memeId,
    competitionId,
    score,
  }: {
    createdById: number;
    memeId: number;
    competitionId: number;
    score: number;
  }) {
    return this.upsert({
      where: {
        createdById_memeId_competitionId: {
          createdById,
          memeId,
          competitionId,
        },
      },
      create: { score, competitionId, createdById, memeId },
      update: { score },
    });
  }
}
