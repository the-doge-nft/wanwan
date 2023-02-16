import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export default class UpdateReward {
  @ApiProperty()
  @IsString()
  txId: string;

  @ApiProperty()
  @IsInt()
  rewardId: number;
}
