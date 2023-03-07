import BaseError from "./Base.error";

class UnauthorizedError extends BaseError {
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}

export default UnauthorizedError;
