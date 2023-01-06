import { FormApi, FORM_ERROR } from "final-form";
import { PropsWithChildren } from "react";
import { Form as FinalForm } from "react-final-form";
import { css } from "../../helpers/css";
import { jsonify } from "../../helpers/strings";
import ApiError from "../../services/exceptions/Api.error";
import Code from "../Code/Code";
import { DevToggle } from "../Dev/Dev";

interface FormProps {
  onSubmit: (data: Record<string, any>, form: FormApi) => Promise<any>;
}

const Form: React.FC<PropsWithChildren<FormProps>> = ({
  children,
  onSubmit,
}) => {
  // @next add error middleware in axios http helper
  const apiErrorMiddleware = (data: Record<string, any>, form: FormApi) => {
    return onSubmit(data, form).catch((e) => {
      if (e instanceof ApiError) {
        return { [FORM_ERROR]: e.message };
      } else {
        throw e;
      }
    });
  };

  return (
    <FinalForm
      onSubmit={(data, form) => apiErrorMiddleware(data, form)}
      render={({ handleSubmit, submitError, values, errors }) => {
        return (
          <>
            <form onSubmit={handleSubmit}>{children}</form>
            <DevToggle>
              <div>
                <div>values</div>
                <Code>{jsonify(values)}</Code>
              </div>
              <div className={css("mt-4")}>
                <div>errors</div>
                <Code>{jsonify(errors)}</Code>
              </div>
            </DevToggle>
          </>
        );
      }}
    />
  );
};

export default Form;
