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
      "max" | "min" | "placeholder" | "block" | "disabled"
    > {}

const NumberInput = ({
  name,
  value,
  onChange,
  label,
  validate,
  description,
  disabled,
  ...rest
}: NumberInputProps) => {
  const { input, meta, isRequired } = useFormField(name, validate);
  useControlledFormField(input.onChange, value);
  return (
    <FormControl
      description={description}
      isRequired={isRequired}
      name={name}
      label={label}
      disabled={disabled}
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
