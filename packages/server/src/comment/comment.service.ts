import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from './../prisma.service';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}
  create(args: Prisma.CommentCreateArgs) {
    return this.prisma.comment.create(args);
  }
}
