import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from './../prisma.service';

@Injectable()
export class SubmissionService {
  constructor(private readonly prisma: PrismaService) {}

  create(args: Prisma.SubmissionCreateArgs) {
    return this.prisma.submission.create(args);
  }
}
