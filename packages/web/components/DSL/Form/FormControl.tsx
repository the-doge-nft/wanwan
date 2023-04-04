import React, { PropsWithChildren } from "react";
import { useField } from "react-final-form";
import { css } from "../../../helpers/css";
import Text, { TextSize, TextType } from "../Text/Text";
import { ValidatorFunction } from "./validation";

export interface BaseFormInputProps {
  name: string;
  value?: string | number;
  onChange?: (value: any) => void;
  label?: React.ReactNode;
  validate?: ValidatorFunction[] | ValidatorFunction;
  description?: string;
}

export const BaseInvalidInputStyle = css("border-[1px]", "!border-red-800");
const errorTextCss = css("text-red-800");
export interface FormControlProps
  extends Pick<BaseFormInputProps, "label" | "name" | "description"> {
  children: any;
  isRequired?: boolean;
  disabled?: boolean;
}

const FormControl = ({
  label,
  children,
  name,
  isRequired,
  description,
  disabled = false,
}: FormControlProps) => {
  const { meta } = useField(name, {
    subscription: { touched: true, error: true, pristine: true, visited: true },
  });
  const isInvalid = meta.error && meta.touched;
  return (
    <div className={css("w-full")}>
      <FormDisplay
        isInvalid={isInvalid}
        label={label}
        description={description}
        isRequired={isRequired}
        disabled={disabled}
      />
      {children}
      {isInvalid && (
        <div className={css(errorTextCss, "text-xs", "mt-0.5")}>
          {meta.error}
        </div>
      )}
    </div>
  );
};

export const FormDisplay = ({
  label,
  description,
  isRequired,
  isInvalid,
  disabled,
}: Pick<FormControlProps, "label" | "description" | "isRequired"> & {
  isInvalid?: boolean;
  disabled?: boolean;
}) => {
  return (
    <>
      {label && (
        <FormLabel
          mb={!description}
          isRequired={isRequired}
          isInvalid={isInvalid}
          isDisabled={disabled}
        >
          {label}
        </FormLabel>
      )}
      {description && (
        <FormDescription isInvalid={isInvalid}>{description}</FormDescription>
      )}
    </>
  );
};

interface FormLabelProps {
  isInvalid?: boolean;
  isRequired?: boolean;
  mb?: boolean;
  isDisabled?: boolean;
}

export const FormLabel: React.FC<PropsWithChildren<FormLabelProps>> = ({
  children,
  isInvalid,
  isRequired,
  mb = true,
  isDisabled,
}) => {
  return (
    <div
      className={css("text-black", "dark:text-white", {
        [css("text-neutral-500")]: isDisabled,
        [errorTextCss]: isInvalid,
        flex: isRequired,
        "mb-0.5": mb,
      })}
    >
      <Text size={TextSize.sm} block>
        <div className={css("inline-flex", "w-full")}>
          {isRequired && "*"}
          {children}
        </div>
      </Text>
    </div>
  );
};

export const FormDescription: React.FC<
  PropsWithChildren<{ isInvalid?: boolean }>
> = ({ children, isInvalid }) => {
  return (
    <div
      className={css("mb-0.5", "italic", "flex", {
        "text-red-900": isInvalid,
        "text-neutral-800": !isInvalid,
      })}
    >
      <Text size={TextSize.xs} type={TextType.Grey}>
        {children}
      </Text>
    </div>
  );
};

export default FormControl;
