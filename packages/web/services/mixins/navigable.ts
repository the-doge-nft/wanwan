import { computed, makeObservable, observable } from "mobx";
import { Constructor } from ".";

export function Navigable<T extends Constructor, K>(Base1: T) {
  abstract class Navigable extends Base1 {
    @observable
    navigationStack: K[] = [];

    protected constructor(...rest: any[]) {
      super();
      makeObservable(this);
    }

    @computed
    get currentView() {
      return this.navigationStack[this.navigationStack.length - 1];
    }

    set currentView(view) {
      this.navigationStack.push(view);
    }

    goBack() {
      this.navigationStack.pop();
    }

    @computed
    get canGoBack() {
      return this.navigationStack.length > 1;
    }
  }
  return Navigable;
}
