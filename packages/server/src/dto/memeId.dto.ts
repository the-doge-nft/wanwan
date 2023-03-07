import { Transform, Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class MemeIdDto {
  @Transform(({ value }) => parseInt(value))
  @Type(() => Number)
  @IsInt()
  memeId: number;
}
