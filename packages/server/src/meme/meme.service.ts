import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { MemeWithDefaultInclude, MemeWithExtras } from './../interface/index';
import { MediaService } from './../media/media.service';
import { UserService } from './../user/user.service';

@Injectable()
export class MemeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly media: MediaService,
    private readonly user: UserService,
  ) {}

  private get defaultInclude() {
    return {
      media: true,
      user: true,
      MemeLikes: true,
    };
  }

  async addExtra({
    MemeLikes,
    ...item
  }: MemeWithDefaultInclude): Promise<MemeWithExtras> {
    if (item === null) return null;
    return {
      ...item,
      media: this.media.addExtra(item.media),
      user: await this.user.addExtra(item.user),
      likes: MemeLikes?.reduce((acc, cur) => acc + cur.score, 0),
    };
  }

  async addExtras(memes: Array<MemeWithDefaultInclude>) {
    const memesWithExtras = [];
    for (const meme of memes) {
      memesWithExtras.push(await this.addExtra(meme));
    }
    return memesWithExtras;
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
      })) as MemeWithDefaultInclude,
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
    const memesWithMedia: MemeWithDefaultInclude[] = subsWithMemes.map(
      (item) => ({
        ...item.meme,
      }),
    );
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

  async findFirstOrFail(args?: Prisma.MemeFindFirstArgs) {
    const data = await this.prisma.meme.findFirst({
      ...args,
      include: this.defaultInclude,
    });
    if (!data) {
      throw new Error('Meme not found');
    }
    return this.addExtra(data);
  }

  async getMemeBelongsToUser(id: number, createdById: number) {
    return !!(await this.findFirst({ where: { id, createdById } }));
  }

  async getRankedMemesByCompetitionId(competitionId: number) {
    const memes = await this.prisma.meme.findMany({
      where: {
        submissions: { some: { competitionId }, every: { deletedAt: null } },
      },
      include: {
        media: true,
        user: true,
        votes: { include: { user: true }, where: { competitionId } },
        comments: true,
        submissions: { where: { competitionId } },
        MemeLikes: true,
      },
    });

    // sort by submission time first
    const memesSortedByCreatedAtSubmission = memes.sort((a, b) => {
      const aSub = a.submissions[0];
      const bSub = b.submissions[0];
      if (aSub.createdAt < bSub.createdAt) {
        return -1;
      }
      if (aSub.createdAt > bSub.createdAt) {
        return 1;
      }
      return 0;
    });

    const memesWithScore = memesSortedByCreatedAtSubmission
      .map((meme) => {
        const score = meme.votes.reduce((acc, cur) => acc + cur.score, 0);
        return { ...meme, score };
      })
      .sort((a, b) => b.score - a.score);
    return this.addExtras(memesWithScore);
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
        MemeLikes: true,
      },
    });
    const memesWithScore = memes.map((meme) => {
      const score = meme.votes.reduce((acc, cur) => acc + cur.score, 0);
      return { ...meme, score };
    });
    return this.addExtras(memesWithScore);
  }

  likeMeme(memeId: number, createdById: number) {
    return this.prisma.memeLikes.upsert({
      where: { createdById_memeId: { memeId, createdById } },
      update: { score: 1 },
      create: { score: 1, memeId, createdById },
    });
  }

  unlikeMeme(memeId: number, createdById: number) {
    return this.prisma.memeLikes.upsert({
      where: { createdById_memeId: { memeId, createdById } },
      update: { score: 0 },
      create: { score: 0, memeId, createdById },
    });
  }

  async getLikesForAddress(address: string) {
    const data = await this.prisma.memeLikes.findMany({
      where: { user: { address }, score: { gt: 0 } },
      select: { memeId: true },
    });
    return data.map((item) => item.memeId);
  }
}
