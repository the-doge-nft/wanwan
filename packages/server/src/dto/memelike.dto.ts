import { Transform, Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';
import IdDto from './id.dto';

export default class MemeLikeDto extends IdDto {
  @Transform(({ value }) => parseInt(value))
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(1)
  score: number;
}
