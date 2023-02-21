import { Prisma, User } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
  user: User;
}

export type CompetitionWithDefaultInclude = Prisma.CompetitionGetPayload<{
  include: {
    curators: { include: { user: true } };
    rewards: { include: { currency: true } };
    user: true;
    submissions: {
      include: { meme: { include: { media: true } } };
      orderBy: { createdAt: 'asc' };
      take: 1;
    };
  };
}>;

export type MemeWithMedia = Prisma.MemeGetPayload<{ include: { media: true } }>;
