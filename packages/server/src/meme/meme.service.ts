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
    };
  }

  private addExtra(item: MemeWithMedia) {
    return { ...item };
  }

  private addExtras(memes: Array<MemeWithMedia>) {
    return memes.map((item) => this.addExtra(item));
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
}
