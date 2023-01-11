import { TokenType } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
  Validate,
  ValidateNested,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import {
  formatEthereumAddress,
  isValidEthereumAddress,
} from './../helpers/strings';

@ValidatorConstraint({ name: 'ethereumAddressValidator' })
class EthereumAddressValidator implements ValidatorConstraintInterface {
  validate(values: string[] = []): boolean {
    return values.every(isValidEthereumAddress);
  }

  defaultMessage(): string {
    return 'Not a valid ethereum address';
  }
}

@ValidatorConstraint({ name: 'uniqueCompetitionRank' })
class UniqueCompetitionRank implements ValidatorConstraintInterface {
  validate(value: RewardsDto[]): boolean | Promise<boolean> {
    const ranks = value.map((item) => item.competitionRank);
    const unique = Array.from(new Set(ranks));
    return ranks.length == unique.length;
  }

  defaultMessage() {
    return 'Rewards competition rank must be unique';
  }
}

@ValidatorConstraint({ name: 'nftTokensTokenIdRequired' })
class NftTokensTokenIdRequired implements ValidatorConstraintInterface {
  validate(
    value: number | undefined,
    validationArguments: ValidationArguments,
  ): boolean | Promise<boolean> {
    const { type } = validationArguments.object as CurrencyDto;
    return !(
      (type === TokenType.ERC1155 || type === TokenType.ERC721) &&
      !value
    );
  }

  defaultMessage() {
    return 'ERC1155 and ERC721 must have currency.tokenId specified';
  }
}

class CurrencyDto {
  @IsNotEmpty()
  @IsEnum(TokenType)
  type: TokenType;

  @IsString()
  contractAddress: string;

  @IsString()
  @Validate(NftTokensTokenIdRequired)
  tokenId?: string;

  @IsNotEmpty()
  @IsString()
  amount: string;
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
  @IsPositive()
  @Min(1)
  maxUserSubmissions: number;

  @IsNotEmpty()
  @IsDateString()
  endsAt: Date;

  @IsArray()
  @ArrayNotEmpty()
  @Validate(EthereumAddressValidator)
  @Transform(({ value }: { value: string[] }) =>
    value.map((address) => formatEthereumAddress(address)),
  )
  curators: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Validate(UniqueCompetitionRank)
  @Type(() => RewardsDto)
  rewards: RewardsDto[];
}
