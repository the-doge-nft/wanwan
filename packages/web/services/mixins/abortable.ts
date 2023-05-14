import { Constructor, guardMixinClassInheritance } from ".";

export function Abortable<T extends Constructor>(Base1: T) {
  class Abortable extends Base1 {
    abortController = new AbortController();

    abort() {
      this.abortController.abort();
      this.abortController = new AbortController();
    }
  }

  guardMixinClassInheritance(Abortable, Base1);
  return Abortable;
}
