import { Transform, Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export default class MemeIdDto {
  @Transform(({ value }) => parseInt(value))
  @Type(() => Number)
  @IsInt()
  id: number;
}
