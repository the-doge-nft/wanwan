import { Transform, Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export default class IdDto {
  @Transform(({ value }) => parseInt(value))
  @Type(() => Number)
  @IsInt()
  id: number;
}
