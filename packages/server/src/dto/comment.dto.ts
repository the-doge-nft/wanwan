import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export default class CommentDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  parentCommentId?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  body: string;
}
