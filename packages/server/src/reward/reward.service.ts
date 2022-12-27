import { Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma.service';

@Injectable()
export class RewardService {
  constructor(private readonly prisma: PrismaService) {}

  upsert(args: any) {
    return this.prisma.reward.upsert(args);
  }
}
