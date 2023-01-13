import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export default class SearchDto {
  @IsString()
  @IsNotEmpty()
  config: string;

  @IsInt()
  count: number;

  @IsInt()
  offset: number;
}
