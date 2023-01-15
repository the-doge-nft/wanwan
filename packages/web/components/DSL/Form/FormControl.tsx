import React, { PropsWithChildren } from "react";
import { useField } from "react-final-form";
import { css } from "../../../helpers/css";
import { ValidatorFunction } from "./validation";

export interface BaseFormInputProps {
  name: string;
  value?: string | number;
  onChange?: (value: any) => void;
  label?: React.ReactNode;
  validate?: ValidatorFunction[] | ValidatorFunction;
  description?: string;
}

export const BaseInvalidInputStyle = css("border-2", "!border-red-800");
const errorTextCss = css("text-red-800");
export interface FormControlProps
  extends Pick<BaseFormInputProps, "label" | "name" | "description"> {
  children: any;
  isRequired: boolean;
}

const FormControl = ({
  label,
  children,
  name,
  isRequired,
  description,
}: FormControlProps) => {
  const { meta } = useField(name, {
    subscription: { touched: true, error: true, pristine: true, visited: true },
  });
  const isInvalid = meta.error && meta.touched;
  return (
    <div className={css("w-full")}>
      {label && (
        <FormLabel
          mb={!description}
          isRequired={isRequired}
          isInvalid={isInvalid}
        >
          {label}
        </FormLabel>
      )}
      {description && (
        <FormDescription isInvalid={isInvalid}>{description}</FormDescription>
      )}
      {children}
      {isInvalid && (
        <div className={css(errorTextCss, "text-xs", "mt-0.5")}>
          {meta.error}
        </div>
      )}
    </div>
  );
};

export const FormLabel: React.FC<
  PropsWithChildren<{ isInvalid?: boolean; isRequired?: boolean; mb?: boolean }>
> = ({ children, isInvalid, isRequired, mb = true }) => {
  return (
    <div
      className={css("text-xs", "text-black", {
        [errorTextCss]: isInvalid,
        flex: isRequired,
        "mb-0.5": mb,
      })}
    >
      {isRequired && "*"}
      {children}
    </div>
  );
};

export const FormDescription: React.FC<
  PropsWithChildren<{ isInvalid?: boolean }>
> = ({ children, isInvalid }) => {
  return (
    <div
      className={css("text-xs", "mb-0.5", "italic", {
        "text-red-900": isInvalid,
        "text-slate-800": !isInvalid,
      })}
    >
      {children}
    </div>
  );
};

export default FormControl;
