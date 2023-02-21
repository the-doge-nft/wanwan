import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from './../prisma.service';

@Injectable()
export class CurrencyService {
  constructor(private readonly prisma: PrismaService) {}

  upsert(args: Prisma.CurrencyUpsertArgs) {
    return this.prisma.currency.upsert(args);
  }

  findFirst(args: Prisma.CurrencyFindFirstArgs) {
    return this.prisma.currency.findFirst(args);
  }

  create(args: Prisma.CurrencyCreateArgs) {
    return this.prisma.currency.create(args);
  }
}
