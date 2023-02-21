import { Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma.service';
import { UserService } from './../user/user.service';

@Injectable()
export class CompetitionCuratorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly user: UserService,
  ) {}

  async upsert(competitionId: number, addresses: string[]) {
    for (const address of addresses) {
      const user = await this.user.upsert({
        where: { address },
        create: { address, lastAuthedAt: new Date() },
        update: {},
      });
      await this.prisma.compeitionCurator.create({
        data: { competitionId, userId: user.id },
      });
    }
  }
}
