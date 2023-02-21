import BaseError from "./Base.error";

class ApiError extends BaseError {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export default ApiError;
