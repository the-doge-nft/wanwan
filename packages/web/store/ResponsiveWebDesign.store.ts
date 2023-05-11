import { makeObservable, observable } from "mobx";

export default class ResponsiveWebDesignStore {
  @observable
  isMobile = false;

  constructor() {
    makeObservable(this);
  }

  init() {
    this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }
}
