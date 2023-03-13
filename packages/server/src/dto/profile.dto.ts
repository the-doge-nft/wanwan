import { IsString } from 'class-validator';

export default class ProfileDto {
  @IsString()
  description;

  @IsString()
  externalUrl;

  @IsString()
  twitterUsername;
}
