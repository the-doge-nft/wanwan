export default class InvalidRewardTxError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'InvalidRewardTxError';
  }
}
