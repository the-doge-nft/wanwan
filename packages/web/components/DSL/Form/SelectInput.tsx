import { css } from "../../../helpers/css";
import Select, { SelectProps } from "../Select/Select";
import FormControl, {
  BaseFormInputProps,
  BaseInvalidInputStyle,
} from "./FormControl";
import { useControlledFormField, useFormField } from "./useFormField";

interface SelectInputProps
  extends BaseFormInputProps,
    Pick<SelectProps, "items" | "defaultValue"> {}

const SelectInput: React.FC<SelectInputProps> = ({
  name,
  value,
  onChange,
  label,
  validate,
  items,
  description,
  defaultValue,
  ...rest
}) => {
  const { input, meta, isRequired } = useFormField(
    name,
    validate,
    defaultValue
  );
  useControlledFormField(input.onChange, value);
  return (
    <FormControl
      description={description}
      isRequired={isRequired}
      name={name}
      label={label}
    >
      <Select
        {...input}
        {...rest}
        className={css({
          [BaseInvalidInputStyle]: meta.error && meta.touched,
        })}
        items={items}
        value={input.value}
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

export default SelectInput;
