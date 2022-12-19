import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export default class CommentDto {
  @IsNotEmpty()
  @IsInt()
  memeId: number;

  @IsOptional()
  @IsNumber()
  parentCommentId?: number;

  @IsNotEmpty()
  @IsString()
  body: string;
}
