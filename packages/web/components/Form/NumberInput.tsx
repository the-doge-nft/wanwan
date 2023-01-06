import Input, { BaseInputProps } from "../Input/Input";
import FormControl, { BaseFormInputProps } from "./FormControl";
import { useControlledFormField, useFormField } from "./useFormField";

interface NumberInputProps
  extends BaseFormInputProps,
    Pick<BaseInputProps, "max" | "min" | "placeholder" | "block"> {}

const NumberInput = ({
  name,
  value,
  onChange,
  label,
  validate,
  block,
  description,
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
    >
      <Input
        {...input}
        {...rest}
        type={"number"}
        value={value}
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
