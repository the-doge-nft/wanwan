import { AxiosError } from "axios";
import { errorToast } from "../../components/DSL/Toast/Toast";
import ApiError from "../exceptions/Api.error";

const ApiErrorInterceptor = (error: AxiosError) => {
  console.log("debug:: GOT ERROR", error);
  if (error.response) {
    const status = error.response.status;
    if (status === 500) {
      errorToast("500 error");
      //@ts-ignore
    } else if (error.response.data && error.response.data.message) {
      // @ts-ignore
      const message = error.response.data.message?.[0];
      errorToast("Didn't work");
      throw new ApiError(message);
    } else if (status === 400) {
      errorToast("400 error");
    } else if (status === 401) {
      errorToast("401 error");
    }
  } else if (error.request) {
    errorToast("Network error");
  }
  throw error;
};

export default ApiErrorInterceptor;
