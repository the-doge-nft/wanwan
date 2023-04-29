import { TokenType } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
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
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
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
    return 'ERC1155 and ERC721 must have tokenId specified';
  }
}

function IsNumberStringGreaterThan(
  minValue: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsNumberStringGreaterThan',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [minValue],
      options: validationOptions,
      validator: {
        validate(value: any, { constraints }: ValidationArguments) {
          return Number(value) > constraints[0];
        },
        defaultMessage() {
          return `Must be a string and greater than ${minValue}`;
        },
      },
    });
  };
}

class VoterDto {
  @IsNotEmpty()
  @IsEnum(TokenType)
  type: TokenType;

  @IsString()
  contractAddress: string;
}

class CurrencyDto {
  @IsNotEmpty()
  @IsEnum(TokenType)
  type: TokenType;

  // @next -- needs to be updated to handle ETH rewards
  @IsNotEmpty()
  @IsString()
  contractAddress: string;

  @IsOptional()
  @IsNumberStringGreaterThan(-1)
  @Validate(NftTokensTokenIdRequired)
  tokenId?: string;

  @IsNotEmpty()
  @IsNumberStringGreaterThan(0)
  amount: string;
}

export class RewardsDto {
  // @next -- currencyTokenAmount and currencyTokenId here
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
  @Transform(({ value }) => (value === '' ? null : value))
  description?: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Min(1)
  maxUserSubmissions: number;

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  endsAt: Date;

  @IsNotEmpty()
  @IsArray()
  @Validate(EthereumAddressValidator)
  @Transform(({ value }: { value: string[] }) =>
    value.map((address) => formatEthereumAddress(address)),
  )
  curators: string[];

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Validate(UniqueCompetitionRank)
  @Type(() => RewardsDto)
  rewards: RewardsDto[];

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VoterDto)
  voters: VoterDto[];
}
