import React, { PropsWithChildren } from "react";
import { useField } from "react-final-form";
import { css } from "../../helpers/css";
import { ValidatorFunction } from "./validation";

export interface BaseInputProps {
  name: string;
  value: string | number;
  onChange: (value: any) => void;
  label?: string;
  validate?: ValidatorFunction[] | ValidatorFunction;
  description?: string;
}

export const BaseInvalidInputStyle = css("border-2", "border-red-700");

interface FormControlProps
  extends Pick<BaseInputProps, "label" | "name" | "description"> {
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
        <FormLabel isRequired={isRequired} isInvalid={isInvalid}>
          {label}
        </FormLabel>
      )}
      {description && <FormDescription>{description}</FormDescription>}
      {children}
      {isInvalid && (
        <div className={css("text-red-500", "text-sm", "mt-1")}>
          {meta.error}
        </div>
      )}
    </div>
  );
};

export const FormLabel: React.FC<
  PropsWithChildren<{ isInvalid: boolean; isRequired: boolean }>
> = ({ children, isInvalid, isRequired }) => {
  return (
    <div
      className={css("mb-1", "text-neutral-400", {
        flex: isRequired,
      })}
    >
      {isRequired && (
        <span
          className={css("mr-1", "text-sm", {
            "text-red-500": isInvalid,
          })}
        >
          *
        </span>
      )}
      {children}
    </div>
  );
};

export const FormDescription: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  return (
    <div className={css("text-sm", "text-neutral-500", "mb-1")}>{children}</div>
  );
};

export default FormControl;
