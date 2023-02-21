import { IsInt } from 'class-validator';

export default class SubmissionDto {
  @IsInt()
  memeId: number;

  @IsInt()
  competitionId: number;
}
