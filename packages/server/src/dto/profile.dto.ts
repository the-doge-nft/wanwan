import { IsOptional, IsString } from 'class-validator';

export default class ProfileDto {
  @IsString()
  @IsOptional()
  description;

  @IsString()
  @IsOptional()
  externalUrl;
}
