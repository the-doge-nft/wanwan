import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CommentWithDefaultInclude } from 'src/interface';
import { PrismaService } from './../prisma.service';
import { UserService } from './../user/user.service';

@Injectable()
export class CommentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly user: UserService,
  ) {}

  private get defaultInclude(): Prisma.CommentInclude {
    return {
      user: true,
      // child: true,
    };
  }

  private async addExtra(comment: CommentWithDefaultInclude) {
    return {
      ...comment,
      user: await this.user.addExtra(comment.user),
    };
  }

  private async addExtras(comments: CommentWithDefaultInclude[]) {
    const commentsWithExtra = [];
    for (const comment of comments) {
      commentsWithExtra.push(await this.addExtra(comment));
    }
    return commentsWithExtra;
  }

  create(data: Prisma.CommentCreateArgs['data']) {
    return this.prisma.comment.create({ data, include: this.defaultInclude });
  }

  async getByMemeId(memeId: number) {
    return this.addExtras(
      (await this.prisma.comment.findMany({
        where: { memeId },
        orderBy: { createdAt: 'desc' },
        include: this.defaultInclude,
      })) as CommentWithDefaultInclude[],
    );
  }
}
