import { IsNotEmpty } from 'class-validator';

export class SiweDto {
  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  signature: string;
}
