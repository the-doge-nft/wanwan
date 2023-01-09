import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from './../prisma.service';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  private get defaultInclude(): Prisma.CommentInclude {
    return {
      user: true,
    };
  }

  create(data: Prisma.CommentCreateArgs['data']) {
    return this.prisma.comment.create({ data, include: this.defaultInclude });
  }

  getByMemeId(memeId: number) {
    return this.prisma.comment.findMany({
      where: { memeId },
      orderBy: { createdAt: 'desc' },
      include: this.defaultInclude,
    });
  }
}
