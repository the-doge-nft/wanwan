import { FieldState } from "final-form";
import {
  isValidEthereumAddress,
  isValidHttpUrl,
} from "../../../helpers/strings";
import Http from "../../../services/http";

export type Validator = ValidatorFunction[] | ValidatorFunction;

export type ValidatorFunction = (
  value: any,
  allValues: Object,
  meta?: FieldState<any>
) => any;

const required = (value: any) => {
  return value && value !== "" ? undefined : "Required";
};

const httpUrl = (value: any) =>
  isValidHttpUrl(value) || value === "" ? undefined : "Must be valid URL";

const mustBeANumber = (value: any) =>
  isNaN(value) ? "Must be a number" : undefined;

const minValue = (min: any) => (value: any) =>
  isNaN(value) || value >= min ? undefined : `Must be greater than ${min}`;

const minDate = (min: string) => (value: string) =>
  new Date(value) > new Date(min) ? undefined : `Must be after ${min}`;

const maxDate = (max: string) => (value: string) =>
  new Date(value) < new Date(max) ? undefined : `Must be before ${max}`;

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

export const isEnsName = (value: any) => {};

const simpleMemoize = (fn: any) => {
  let lastArg: any;
  let lastResult: any;
  return (arg: any) => {
    if (arg !== lastArg) {
      lastArg = arg;
      lastResult = fn(arg);
    }
    return lastResult;
  };
};

export const getIsEnsFormat = (value: string) => {
  return value.split(".")?.[1] === "eth";
};

export const isEthereumAddressOrEns = simpleMemoize(async (value: string) => {
  if (isValidEthereumAddress(value)) {
    return undefined;
  }

  if (getIsEnsFormat(value)) {
    const { data: address } = await Http.postEnsForAddress(value);
    console.log(address);
    if (address) {
      return undefined;
    } else {
      return "Must be a valid Ethereum address or ENS name";
    }
  }

  return "Must be a valid Ethereum address or ENS name";
});

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
  httpUrl as websiteUrl,
  minDate,
  maxDate,
};
