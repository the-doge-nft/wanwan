import { TokenType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
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
  @IsNotEmpty()
  @IsEnum(TokenType)
  type: TokenType;

  @IsString()
  contractAddress: string;

  @IsOptional()
  @IsInt()
  tokenId: number;
}

export class RewardsDto {
  @IsNotEmpty()
  @IsInt()
  competitionRank: number;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CurrencyDto)
  currency: CurrencyDto;

  @IsOptional()
  @IsInt()
  currencyTokenId?: number;

  @IsNotEmpty()
  @IsString()
  currencyAmount: string;
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
  rewards: RewardsDto[];
}
