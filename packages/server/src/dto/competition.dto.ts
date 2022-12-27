import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
  ValidateNested,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isValidEthereumAddress } from './../helpers/strings';

@ValidatorConstraint({ name: 'ethereumAddressValidator' })
class EthereumAddressValidator implements ValidatorConstraintInterface {
  validate(values: string[] = []): boolean {
    return values.every(isValidEthereumAddress);
  }
}
class CurrencyDto {
  @IsString()
  type: string;

  @IsString()
  contractAddress: string;

  @IsOptional()
  @IsInt()
  tokenId: number;
}

class RewardsDto {
  @IsInt()
  competitionRank: number;

  @ValidateNested()
  @Type(() => CurrencyDto)
  currency: CurrencyDto;
}

export class CompetitionDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsInt()
  maxUserSubmissions: number;

  @IsNotEmpty()
  @IsDateString()
  endsAt: Date;

  @IsArray()
  @ArrayNotEmpty()
  @Validate(EthereumAddressValidator, {
    message: 'Not a valid ethereum address',
  })
  curators: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RewardsDto)
  rewards?: RewardsDto[];
}
