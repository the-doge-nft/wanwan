import { FieldState } from "final-form";
import {
  isValidEthereumAddress,
  isValidHttpUrl,
} from "../../../helpers/strings";

export type Validator = ValidatorFunction[] | ValidatorFunction;

export type ValidatorFunction = (
  value: any,
  allValues: Object,
  meta?: FieldState<any>
) => any;

const required = (value: any) => {
  return value && value !== "" ? undefined : "Required";
};

const websiteUrl = (value: any) =>
  isValidHttpUrl(value) || value === "" ? undefined : "Must be valid URL";

const mustBeANumber = (value: any) =>
  isNaN(value) ? "Must be a number" : undefined;

const minValue = (min: any) => (value: any) =>
  isNaN(value) || value >= min ? undefined : `Must be greater than ${min}`;

const maxValue = (max: any, customString?: string) => (value: any) => {
  const stringToReturn = customString
    ? customString
    : `Must be less than ${max}`;
  return isNaN(value) || value <= max ? undefined : stringToReturn;
};

const exactLength = (length: any) => (value: string) =>
  value.length === length ? undefined : "Must be characters long";

const maxDecimalPlaces = (max: number) => (value: any) => {
  const decimals = value.toString().split(".")[1];
  if (decimals) {
    if (decimals.length > max) {
      return "Max precision places";
    }
  }
  return undefined;
};

export const isEthereumAddress = (value: any) => {
  if (isValidEthereumAddress(value)) {
    return undefined;
  } else {
    return "Must be a valid Ethereum address";
  }
};

const composeValidators =
  (...validators: any[]) =>
  (value: any) =>
    validators.reduce(
      (error, validator) => error || validator(value),
      undefined
    );

export {
  required,
  mustBeANumber,
  minValue,
  maxValue,
  exactLength,
  composeValidators,
  maxDecimalPlaces,
  websiteUrl,
};
