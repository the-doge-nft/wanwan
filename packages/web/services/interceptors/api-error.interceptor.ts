import { AxiosError } from "axios";
import { errorToast } from "../../components/DSL/Toast/Toast";
import UnauthorizedError from "../exceptions/Unauthorized.error";

const ApiErrorInterceptor = (error: AxiosError) => {
  if (error.response) {
    const status = error.response.status;
    if (status === 500) {
      errorToast("500 error");
    } else if (status === 401) {
      throw new UnauthorizedError();
      //@ts-ignore
    } else if (error.response.data && error.response.data.message) {
      // @ts-ignore
      const message = error.response.data.message;
      if (message) {
        errorToast(message);
        // throw new ApiError(message);
      } else {
        errorToast("Error");
        // throw new ApiError("Did not work");
      }
    } else if (status === 400) {
      errorToast("400 error");
    }
  } else if (error.request) {
    errorToast("Network error");
  }
  throw error;
};

export default ApiErrorInterceptor;
