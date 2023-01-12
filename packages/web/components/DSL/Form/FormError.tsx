import { useFormState } from "react-final-form";
import { css } from "../../../helpers/css";

const FormError = () => {
  const { submitError } = useFormState();
  return (
    <>
      {submitError && (
        <div className={css("text-xs", "text-red-500")}>{submitError}</div>
      )}
    </>
  );
};

export default FormError;
