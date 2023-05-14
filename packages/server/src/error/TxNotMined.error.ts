export default class TxNotMined extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'TxNotMined';
  }
}
