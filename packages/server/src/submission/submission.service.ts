import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from './../prisma.service';

@Injectable()
export class SubmissionService {
  constructor(private readonly prisma: PrismaService) {}

  private get defaultInclude() {
    return {
      meme: true,
      competition: true,
      user: true,
    };
  }

  create(args: Prisma.SubmissionCreateArgs) {
    return this.prisma.submission.create(args);
  }

  findMany(args: Prisma.SubmissionFindManyArgs) {
    return this.prisma.submission.findMany({
      ...args,
      include: this.defaultInclude,
    });
  }

  async update(args: Prisma.SubmissionUpdateArgs) {
    const submission = await this.prisma.submission.update(args)
    return this.findMany({where: {id: submission.id}})
  }
}
