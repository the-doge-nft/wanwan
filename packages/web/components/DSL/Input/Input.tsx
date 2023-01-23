import { css } from "../../../helpers/css";
import Spinner, { SpinnerSize } from "../Spinner/Spinner";
import { defaultBgCss } from "../Theme";

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
  type?: "text" | "textarea" | "number" | "date";
}

export type InputProps = BaseInputProps & ValueProps;

export const textFieldBaseStyles = css(
  "text-black",
  "py-1",
  "px-2",
  "appearance-none",
  "disabled:bg-neutral-800",
  "placeholder-neutral-600",
  "text-sm",
  "focus:outline-none",
  "border-[1px]",
  "border-black",
  "dark:border-neutral-600",
  "text-black",
  "dark:text-white",
  defaultBgCss
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
          [css("text-slate-400", "border-slate-500", "cursor-not-allowed")]:
            disabled,
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
