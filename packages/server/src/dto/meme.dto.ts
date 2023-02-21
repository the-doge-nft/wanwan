import { IsOptional, IsString } from 'class-validator';

export class MemeDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
