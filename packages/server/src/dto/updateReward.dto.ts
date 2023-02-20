import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export default class UpdateReward {
  @ApiProperty()
  @IsString()
  txId: string;
}
