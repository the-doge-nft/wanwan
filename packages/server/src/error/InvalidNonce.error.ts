export class InvalidNonceError extends Error {
  constructor() {
    super('Invalid nonce');
  }
}
