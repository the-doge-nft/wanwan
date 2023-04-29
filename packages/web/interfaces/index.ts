import {
  OwnedNft,
  TokenBalanceSuccess,
  TokenMetadataResponse,
} from "alchemy-sdk";

type DatetimeString = string;
export type Nullable<T> = T | null;

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
  ens: Nullable<string>;
}

export interface Reward {
  id: number;
  txId: string;
  competitionId: number;
  receivedById: number;
  currencyId: number;
  competitionRank: number;
  currencyTokenId: string;
  currencyAmountAtoms: string;
  createdAt: DatetimeString;
  updatedAt: DatetimeString;
  currency: Currency;
}

export enum TokenType {
  ERC1155 = "ERC1155",
  ERC721 = "ERC721",
  ERC20 = "ERC20",
  ETH = "ETH",
}

export interface Currency {
  type: TokenType;
  contractAddress: string;
  decimals: number;
  symbol: string;
  name: string;
}

// @next -- currencyAmount and currencyTokenId should be here
export interface RewardBody {
  competitionRank: number;
  currency: {
    type: TokenType;
    contractAddress: string;
    tokenId: string;
    amount: string;
  };
}

export interface VotingRule {}

export interface Competition {
  id: number;
  name: string;
  description: string;
  maxUserSubmissions: number;
  endsAt: DatetimeString;
  createdAt: DatetimeString;
  updatedAt: DatetimeString;
  createdById: number;
  isActive: boolean;
  coverMedia?: Media;
  curators: User[];
  rewards: Reward[];
  user: User;
  votingRule: VotingRule[];
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
}

export interface Submission {
  id: number;
  memeId: number;
  competitionId: number;
  createdAt: DatetimeString;
  deletedAt?: DatetimeString;
  createdById: number;
}

export interface MemeWithVotes extends Meme {
  votes: Array<Vote>;
}

export interface MemeWithScore extends Meme {
  score: number;
}

export interface CompetitionMeme extends MemeWithVotes, MemeWithScore {
  comments: Array<Comment>;
  submissions: Array<Submission>;
}

export interface Profile {
  ens: null | string;
  address: string;
  avatar: string;
  user: User;
  memes: Array<Meme>;
  wan: number;
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

export interface Tweet {
  data: {
    edit_history_tweet_ids: string[];
    id: string;
    text: string;
  };
}
export interface TweetReply {
  data: {
    edit_history_tweet_ids: string[];
    id: string;
    text: string;
  };
}

export interface SearchParams {
  count: number;
  offset: number;
  sorts: Array<{ key: string; direction: string }>;
  filters: any[];
}
export interface SearchResponse<T> {
  data: T[];
  next: string | null;
}

export interface ProfileDto {
  description: Nullable<string>;
  externalUrl: Nullable<string>;
}

export interface EthBalance {
  tokenBalance: string;
  metadata: TokenMetadataResponse;
}

export interface Wallet {
  nft: Array<OwnedNft>;
  erc20: Array<ERC20Balance>;
  eth: EthBalance;
}

export interface ERC20Balance extends TokenBalanceSuccess {
  metadata: TokenMetadataResponse;
}

export type NextString = Nullable<string> | undefined;
