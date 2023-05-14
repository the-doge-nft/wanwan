import { css } from "../../../helpers/css";
import Input, { InputProps } from "../Input/Input";
import FormControl, {
  BaseFormInputProps,
  BaseInvalidInputStyle,
} from "./FormControl";
import { useControlledFormField, useFormField } from "./useFormField";

interface TextInputProps
  extends BaseFormInputProps,
    Pick<
      InputProps,
      "placeholder" | "block" | "disabled" | "defaultValue" | "type"
    > {}

const TextInput = ({
  name,
  value,
  onChange,
  label,
  validate,
  description,
  type = "text",
  disabled,
  defaultValue,
  rightOfInput,
  leftOfInput,
  ...rest
}: TextInputProps) => {
  const { input, meta, isRequired } = useFormField(
    name,
    validate,
    defaultValue as string
  );
  useControlledFormField(input.onChange, value);

  return (
    <FormControl
      disabled={disabled}
      description={description}
      isRequired={isRequired}
      name={name}
      label={label}
      rightOfInput={rightOfInput}
      leftOfInput={leftOfInput}
    >
      <Input
        {...input}
        {...rest}
        disabled={disabled}
        type={type}
        value={input.value}
        className={css({
          [BaseInvalidInputStyle]: meta.error && meta.touched,
        })}
        onChange={(val) => {
          input.onChange(val);
          if (onChange) {
            onChange(val);
          }
        }}
      />
    </FormControl>
  );
};

export default TextInput;
