import { useEffect } from "react";
import { useField } from "react-final-form";
import { composeValidators, required, Validator } from "./validation";

export const useFormField = (
  name: string,
  validate?: Validator,
  defaultValue: string | number = "",
  isCheckbox: boolean = false
) => {
  const isRequired = Array.isArray(validate)
    ? validate.includes(required)
    : validate === required;
  const validators = Array.isArray(validate)
    ? composeValidators(...validate)
    : validate;

  const parse = (value: any) => {
    if (value === undefined || value === null) {
      return "";
    } else {
      return value;
    }
  };

  const { input, meta } = useField(name, {
    //@ts-ignore
    validate: validators,
    validateFields: [],
    initialValue: defaultValue,
    defaultValue: defaultValue,
    type: isCheckbox ? "checkbox" : "input",
    /*
            without below parse fn, empty string input's keys are removed from the form state,
            screwing up FormState.modified & FormState.dirty.
            https://github.com/final-form/react-final-form/issues/130

            we return "" for undefined & nulls to avoid react controlled to uncontrolled warnings
        * */
    parse: parse,
  });
  return {
    isRequired,
    input,
    meta,
  };
};

export const useControlledFormField = (
  inputOnChange: (value: any) => void,
  value: any
) => {
  // TODO: probably change this
  // if controlled
  // - onChange handler from input calls onChange prop
  // - onChange prop *should* change the value prop causing below effect to update the actual input
  // - if value is changed from the outside, we need this effect to update the input
  useEffect(() => {
    if (value !== undefined && value !== null) {
      inputOnChange(value);
    }
  }, [value, inputOnChange]);
};
