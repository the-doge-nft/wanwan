import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { MemeWithMedia } from './../interface/index';
import { MediaService } from './../media/media.service';

@Injectable()
export class MemeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly media: MediaService,
  ) {}

  private get defaultInclude() {
    return {
      media: true,
      user: true,
    };
  }

  addExtra(item: MemeWithMedia) {
    return { ...item, media: this.media.addExtra(item.media) };
  }

  addExtras(memes: Array<MemeWithMedia>) {
    return memes.map((item) => this.addExtra(item));
  }

  count(args?: Prisma.MemeCountArgs) {
    return this.prisma.meme.count(args);
  }

  async create(
    file: Express.Multer.File,
    meme: Pick<
      Prisma.MemeCreateArgs['data'],
      'name' | 'description' | 'createdById'
    >,
  ) {
    const media = await this.media.create(file, meme.createdById);
    return this.addExtra(
      (await this.prisma.meme.create({
        data: {
          name: meme.name,
          description: meme.description,
          createdById: meme.createdById,
          mediaId: media.id,
        },
        include: this.defaultInclude,
      })) as MemeWithMedia,
    );
  }

  // @next move to submission service?
  async getByCompetitionId(competitionId: number) {
    const subsWithMemes = await this.prisma.submission.findMany({
      where: { competitionId },
      include: {
        meme: {
          include: this.defaultInclude,
        },
      },
      orderBy: {
        meme: {
          createdAt: 'desc',
        },
      },
    });
    const memesWithMedia: MemeWithMedia[] = subsWithMemes.map((item) => ({
      ...item.meme,
    }));
    return this.addExtras(memesWithMedia);
  }

  async findMany(args?: Prisma.MemeFindManyArgs) {
    return this.addExtras(
      await this.prisma.meme.findMany({
        ...args,
        include: this.defaultInclude,
      }),
    );
  }

  async findFirst(args?: Prisma.MemeFindFirstArgs) {
    return this.addExtra(
      await this.prisma.meme.findFirst({
        ...args,
        include: this.defaultInclude,
      }),
    );
  }

  async getMemeBelongsToUser(id: number, createdById: number) {
    return !!(await this.findFirst({ where: { id, createdById } }));
  }

  async getRankedMemesByCompetition(competitionId: number) {
    const memes = await this.prisma.meme.findMany({
      where: { submissions: { some: { competitionId } } },
      include: {
        media: true,
        user: true,
        votes: { include: { user: true }, where: { competitionId } },
        comments: true,
        submissions: { where: { competitionId } },
      },
    });

    const memesWithScore = memes.map((meme) => {
      const score = meme.votes.reduce((acc, cur) => acc + cur.score, 0);
      return { ...meme, score };
    });

    const memesSortedByScore = memesWithScore.sort((a, b) => {
      return b.score - a.score;
    });

    // check if any votes are tied, if so, then sort by submission their time
    // for (const meme of memesSortedByScore) {
    //   const tiedMemes = memesSortedByScore.filter(
    //     (m) => m.score === meme.score && m.id !== meme.id,
    //   );
    //   if (tiedMemes.length) {
    //     const sortedTiedMemes = tiedMemes.sort((a, b) => {
    //       const aSub = a.submissions[0];
    //       const bSub = b.submissions[0];
    //       if (aSub.createdAt < bSub.createdAt) {
    //         return -1;
    //       }
    //       if (aSub.createdAt > bSub.createdAt) {
    //         return 1;
    //       }
    //       return 0;
    //     });
    //     const index = memesSortedByScore.findIndex((m) => m.id === meme.id);
    //     memesSortedByScore.splice(index, 1, ...sortedTiedMemes);
    //   }
    // }

    console.log(
      'debug:: fileteredMemes',
      JSON.stringify(memesSortedByScore, undefined, 2),
    );
    return this.addExtras(memesSortedByScore);
  }

  // next -- very similar to above
  async getSubmittedByCompetitionId(competitionId: number, address: string) {
    const memes = await this.prisma.meme.findMany({
      where: { submissions: { some: { competitionId } }, user: { address } },
      include: {
        media: true,
        user: true,
        votes: { include: { user: true }, where: { competitionId } },
        comments: true,
        submissions: { where: { competitionId } },
      },
    });
    const memesWithScore = memes.map((meme) => {
      const score = meme.votes.reduce((acc, cur) => acc + cur.score, 0);
      return { ...meme, score };
    });
    return this.addExtras(memesWithScore);
  }
}
