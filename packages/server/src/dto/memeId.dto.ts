import { IsNotEmpty, IsNumber } from 'class-validator';

export default class MemeIdDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
