import { Injectable } from '@nestjs/common';
import { CompetitionService } from 'src/competition/competition.service';
import { MemeService } from 'src/meme/meme.service';
import { UserService } from './../user/user.service';

@Injectable()
export class StatsService {
  constructor(
    private readonly meme: MemeService,
    private readonly user: UserService,
    private readonly competition: CompetitionService,
  ) {}

  async get() {
    const totalUsers = await this.user.count();
    const totalMemes = await this.meme.count();
    const totalCompetitions = await this.competition.count();
    const totalActiveCompetitions = await this.competition.count({
      where: {
        endsAt: { lte: new Date() },
      },
    });
    console.log(totalActiveCompetitions);
    return {
      totalUsers,
      totalMemes,
      totalCompetitions,
      totalActiveCompetitions,
    };
  }
}
