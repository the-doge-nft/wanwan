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
      "placeholder" | "block" | "disabled" | "type" | "defaultValue"
    > {
  type?: "text" | "textarea";
}

const TextInput = ({
  name,
  value,
  onChange,
  label,
  validate,
  description,
  type = "text",
  ...rest
}: TextInputProps) => {
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
        type={type}
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
