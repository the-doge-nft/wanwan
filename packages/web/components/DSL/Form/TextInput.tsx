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
  ...rest
}: TextInputProps) => {
  const { input, meta, isRequired } = useFormField(
    name,
    validate,
    defaultValue as string
  );
  // const form = useForm();
  console.log(input, meta.error, isRequired);
  useControlledFormField(input.onChange, value);

  // useEffect(() => {
  //   return () => {
  //     console.log("form", form);
  //     console.log("resetting field state:", name);

  //     if (form) {
  //       form.pauseValidation();
  //       console.log("form");
  //     }
  //   };
  // }, [form, name]);

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
