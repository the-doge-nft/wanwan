type DatetimeString = string;

export interface User {
  id: number;
  address: string;
  description: string;
  externalUrl: string;
  twitterUsername: string;
  isVerified: boolean;
  createdAt: DatetimeString;
  updatedAt: DatetimeString;
  lastAuthedAt: DatetimeString;
  deletedAt: DatetimeString;
  isSuperAdmin: boolean;
}

export interface Reward {
  id: number;
  txId: string;
  competitionId: number;
  receivedById: number;
  currencyId: number;
  competitionRank: number;
  currencyTokenId: string;
  currencyAmount: string;
  createdAt: DatetimeString;
  updatedAt: DatetimeString;
}

export interface Competition {
  id: number;
  name: string;
  description: string;
  maxUserSubmissions: number;
  endsAt: DatetimeString;
  createdAt: DatetimeString;
  updatedAt: DatetimeString;
  createdById: number;
  curators: User[];
  rewards: Reward[];
  user: User;
}

export interface Vote {
  id: number;
  competitionId: number;
  createdById: number;
  memeId: number;
  score: number;
  createdAt: DatetimeString;
  updatedAt: DatetimeString;
  user: User;
}

export interface Media {
  id: number;
  width: number;
  height: number;
  filename: string;
  filesize: number;
  s3BucketName: string;
  createdById: number;
  createdAt: DatetimeString;
  url: string;
}

export interface Meme {
  id: number;
  name: string;
  description?: string;
  createdAt: DatetimeString;
  updatedAt: DatetimeString;
  deletedAt?: DatetimeString;
  createdById: number;
  mediaId: number;
  media: Media;
  user: User;
  votes: Array<Vote>;
  comments: Array<Comment>;
}

export interface MemeWithVotes extends Meme {
  votes: Vote[];
}

export interface Profile {
  ens: null | string;
  address: string;
  avatar: string;
  user: User;
  memes: Array<Meme>;
}

export interface MediaRequirements {
  maxSizeBytes: number;
  mimeTypeToExtensionMap: { [key: string]: string[] };
}

export interface Comment {
  body: string;
  createdAt: DatetimeString;
  createdById: number;
  deletedAt: DatetimeString | null;
  id: number;
  memeId: number;
  parentCommentId: number | null;
  updatedAt: DatetimeString;
  user: User;
}

export interface Stats {
  totalMemes: number;
  totalUsers: number;
  totalCompetitions: number;
  totalActiveCompetitions: number;
}

export interface SearchParams {
  count: number;
  offset: number;
  config: string;
}

export interface SearchResponse<T> {
  data: T[];
  next: string | null;
}
