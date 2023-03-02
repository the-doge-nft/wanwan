import { css } from "../../../helpers/css";
import Spinner, { SpinnerSize } from "../Spinner/Spinner";
import { bgColorCss } from "../Theme";

type NativeTextFieldProps =
  | React.HTMLProps<HTMLInputElement>
  | React.HTMLProps<HTMLTextAreaElement>;

interface DefaultValueNoValue
  extends Pick<NativeTextFieldProps, "defaultValue"> {
  value?: never;
}

interface ValueNoDefaultValue extends Pick<NativeTextFieldProps, "value"> {
  defaultValue?: never;
}

type ValueProps = DefaultValueNoValue | ValueNoDefaultValue;
export interface BaseInputProps
  extends Pick<
    NativeTextFieldProps,
    "placeholder" | "name" | "type" | "max" | "min" | "defaultValue"
  > {
  onChange?: (value: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  name?: string;
  block?: boolean;
  className?: string;
  type?: "text" | "textarea" | "number" | "date" | "datetime-local";
}

export type InputProps = BaseInputProps & ValueProps;

export const textFieldBaseStyles = css(
  "text-black",
  "py-1",
  "px-2",
  "appearance-none",
  "placeholder-neutral-600",
  "text-sm",
  "focus:outline-none",
  "border-[1px]",
  "border-black",
  "dark:border-neutral-600",
  "text-black",
  "dark:text-white",
  bgColorCss
);

const disabledStyles = css(
  "text-neutral-400",
  "border-neutral-500",
  "cursor-not-allowed",
  "dark:disabled:bg-neutral-800",
  "disabled:bg-neutral-200"
);

const Input = ({
  onChange,
  isLoading = false,
  disabled = false,
  value,
  name,
  placeholder,
  block,
  type = "text",
  className,
  ...rest
}: InputProps) => {
  const isTextArea = type === "textarea";
  const Component = isTextArea ? "textarea" : "input";
  return (
    <div
      className={css("relative", { "w-full": block, "inline-block": !block })}
    >
      <Component
        {...rest}
        value={value}
        name={name}
        type={isTextArea ? undefined : type}
        disabled={disabled || isLoading}
        placeholder={placeholder}
        onChange={(e) => {
          onChange && onChange(e.target.value);
        }}
        className={css(textFieldBaseStyles, className, {
          "w-full": block,
          [disabledStyles]: disabled,
        })}
      />
      {isLoading && (
        <div
          className={css(
            "w-full",
            "h-full",
            "absolute",
            "flex",
            "items-center",
            "justify-center"
          )}
          style={{ left: 0, top: 0 }}
        >
          <Spinner size={SpinnerSize.sm} />
        </div>
      )}
    </div>
  );
};

export default Input;
