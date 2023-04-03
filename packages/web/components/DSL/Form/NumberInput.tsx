import { css } from "../../../helpers/css";
import Input, { BaseInputProps } from "../Input/Input";
import FormControl, {
  BaseFormInputProps,
  BaseInvalidInputStyle,
} from "./FormControl";
import { useControlledFormField, useFormField } from "./useFormField";

interface NumberInputProps
  extends BaseFormInputProps,
    Pick<
      BaseInputProps,
      "max" | "min" | "placeholder" | "block" | "disabled" | "defaultValue"
    > {}

const NumberInput = ({
  name,
  value,
  onChange,
  label,
  validate,
  description,
  disabled,
  defaultValue,
  ...rest
}: NumberInputProps) => {
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
    >
      <Input
        {...input}
        {...rest}
        disabled={disabled}
        type={"number"}
        value={input.value}
        className={css({
          [BaseInvalidInputStyle]: meta.error && meta.touched,
        })}
        onChange={(value) => {
          input.onChange(value);
          if (onChange) {
            onChange(value);
          }
        }}
      />
    </FormControl>
  );
};

export default NumberInput;
