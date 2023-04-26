import { FORM_ERROR, FormApi } from "final-form";
import { PropsWithChildren } from "react";
import { Form as FinalForm } from "react-final-form";
import ApiError from "../../../services/exceptions/Api.error";

interface FormProps {
  onSubmit: (data: Record<string, any>, form: FormApi) => Promise<any>;
  className?: string;
}

const Form: React.FC<PropsWithChildren<FormProps>> = ({
  children,
  onSubmit,
  className,
}) => {
  const apiErrorMiddleware = (data: Record<string, any>, form: FormApi) => {
    return onSubmit(data, form).catch((e) => {
      if (e instanceof ApiError) {
        // @next -- add input specific errors here. we need logic server side as well
        return { [FORM_ERROR]: e.message };
      } else {
        throw e;
      }
    });
  };

  return (
    <FinalForm
      resetOnSubmitSucceed
      destroyOnUnregister
      onSubmit={(data, form) => apiErrorMiddleware(data, form)}
      render={({ handleSubmit, values, errors, submitError, submitErrors }) => {
        return (
          <>
            <form className={className} onSubmit={handleSubmit}>
              {children}
            </form>
            {/* <DevToggle>
              <div>
                <div>values</div>
                <Code>{jsonify(values)}</Code>
              </div>
              <div className={css("mt-4")}>
                <div>errors</div>
                <Code>{jsonify(errors)}</Code>
              </div>
            </DevToggle> */}
          </>
        );
      }}
    />
  );
};

export default Form;
