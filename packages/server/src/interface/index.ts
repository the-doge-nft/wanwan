import { Media, Meme, Prisma, User } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
  user: User;
}

export type CompetitionWithDefaultInclude = Prisma.CompetitionGetPayload<{
  include: {
    curators: { include: { user: true } };
    rewards: { include: { currency: true } };
    user: true;
    coverMedia: true;
    votingRule: {
      include: {
        currency: true;
      };
    };
  };
}>;

export type MemeWithDefaultInclude = Prisma.MemeGetPayload<{
  include: { media: true; user: true; MemeLikes: true };
}>;

export type CommentWithDefaultInclude = Prisma.CommentGetPayload<{
  include: { user: true };
}>;

export interface MediaWithExtras extends Media {
  url: string;
}

export interface UserWithExtras extends User {
  ens: string | null;
}

export interface MemeWithExtras extends Meme {
  media: MediaWithExtras;
  user: UserWithExtras;
  likes: number;
}
