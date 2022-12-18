import { IsInt, IsNumber, IsOptional } from 'class-validator';

export default class CommentDto {
  @IsInt()
  memeId: number;

  @IsOptional()
  @IsNumber()
  parentCommentId?: number;
}
