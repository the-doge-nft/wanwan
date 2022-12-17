import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
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
}
