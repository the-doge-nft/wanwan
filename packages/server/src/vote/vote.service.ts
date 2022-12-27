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
}
