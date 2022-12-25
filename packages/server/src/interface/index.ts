import { Prisma, User } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
  user: User;
}

export type CompetitionWithCuratorUsers = Prisma.CompetitionGetPayload<{
  include: { curators: { include: { user: true } } };
}>;

export type MemeWithMedia = Prisma.MemeGetPayload<{ include: { media: true } }>;
