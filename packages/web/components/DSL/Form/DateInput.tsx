import { css } from "../../../helpers/css";
import Input, { BaseInputProps } from "../Input/Input";
import FormControl, {
  BaseFormInputProps,
  BaseInvalidInputStyle,
} from "./FormControl";
import { useControlledFormField, useFormField } from "./useFormField";

interface DateInputProps
  extends BaseFormInputProps,
    Pick<
      BaseInputProps,
      "max" | "min" | "placeholder" | "block" | "defaultValue"
    > {}

const DateInput = ({
  name,
  value,
  onChange,
  label,
  validate,
  description,
  defaultValue,
  ...rest
}: DateInputProps) => {
  const { input, meta, isRequired } = useFormField(
    name,
    validate,
    defaultValue as string
  );
  useControlledFormField(input.onChange, value);
  return (
    <FormControl
      description={description}
      isRequired={isRequired}
      name={name}
      label={label}
    >
      <Input
        {...input}
        {...rest}
        type={"date"}
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

export default DateInput;
