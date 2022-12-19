import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export default class CommentDto {
  @IsOptional()
  @IsNumber()
  parentCommentId?: number;

  @IsNotEmpty()
  @IsString()
  body: string;
}
