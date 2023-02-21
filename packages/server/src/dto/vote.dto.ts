import { IsInt, Max, Min } from 'class-validator';

export default class VoteDto {
  @IsInt()
  memeId: number;

  @IsInt()
  @Min(-1)
  @Max(1)
  score: number;
}
