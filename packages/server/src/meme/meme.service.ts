import { Injectable } from '@nestjs/common';
import { Meme, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { MediaService } from './../media/media.service';

@Injectable()
export class MemeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly media: MediaService,
  ) {}

  private addExtras(items: Meme[]) {
    return items.map((item) => item);
  }

  async create(
    file: Express.Multer.File,
    meme: Pick<
      Prisma.MemeCreateArgs['data'],
      'name' | 'description' | 'createdById'
    >,
  ) {
    const media = await this.media.create(file, meme.createdById);
    return this.prisma.meme.create({
      data: {
        name: meme.name,
        description: meme.description,
        createdById: meme.createdById,
        mediaId: media.id,
      },
    });
  }

  getByCompetitionId(competitionId: number) {
    return this.prisma.submission.findMany({
      where: { competitionId },
      include: {
        meme: {
          include: {
            media: true,
          },
        },
      },
    });
  }

  async findMany(args: Prisma.MemeFindManyArgs) {
    return this.addExtras(
      await this.prisma.meme.findMany({
        ...args,
        include: {
          media: true,
        },
      }),
    );
  }
}
