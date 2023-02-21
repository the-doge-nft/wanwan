export default abstract class BaseError extends Error {
  constructor(...args: any) {
    super(...args);
    try {
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, BaseError);
      }
    } catch (e) {
      console.error("couldn't capture stack trace", e);
    }
  }
}
