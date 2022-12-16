import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { MediaService } from './../media/media.service';

@Injectable()
export class MemeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly media: MediaService,
  ) {}

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
}
