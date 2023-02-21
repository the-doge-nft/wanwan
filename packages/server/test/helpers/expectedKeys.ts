export const userKeys = [
  'id',
  'address',
  'description',
  'externalUrl',
  'twitterUsername',
  'isVerified',
  'createdAt',
  'updatedAt',
  'lastAuthedAt',
  'deletedAt',
  'isSuperAdmin',
];

export const memeKeys = [
  'id',
  'name',
  'description',
  'createdAt',
  'updatedAt',
  'deletedAt',
  'createdById',
  'media',
];

export const mediaKeys = [
  'id',
  'width',
  'height',
  'filename',
  'filesize',
  's3BucketName',
  'createdById',
  'createdAt',
];

export const commentKeys = [
  'id',
  'body',
  'createdAt',
  'updatedAt',
  'deletedAt',
  'createdById',
  'memeId',
  'parentCommentId',
];

export const competitionKeys = [
  'id',
  'name',
  'description',
  'maxUserSubmissions',
  'endsAt',
  'createdAt',
  'updatedAt',
  'createdById',
];

export const voteKeys = [
  'id',
  'comeptitionId',
  'createdById',
  'memeId',
  'score',
  'createdAt',
  'deletedAt',
];
