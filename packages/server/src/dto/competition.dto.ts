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
  Max,
  Min,
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

@ValidatorConstraint({ name: 'uniqueCompetitionRank' })
class UniqueCompetitionRank implements ValidatorConstraintInterface {
  validate(value: RewardsDto[]): boolean | Promise<boolean> {
    const ranks = value.map((item) => item.competitionRank);
    const unique = Array.from(new Set(ranks));
    return ranks.length == unique.length;
  }
}

class CurrencyDto {
  @IsNotEmpty()
  @IsEnum(TokenType)
  type: TokenType;

  @IsString()
  contractAddress: string;
}

export class RewardsDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(3)
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
  @Validate(UniqueCompetitionRank, {
    message: 'Rewards competition rank must be unique',
  })
  @Type(() => RewardsDto)
  rewards: RewardsDto[];
}
