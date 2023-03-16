import axios from "axios";
import { Constructor, EmptyClass, guardMixinClassInheritance } from ".";

export function CancelableTokens<T extends Constructor>(Base1: T) {
  const CancelableTokens = class extends Base1 {
    protected cancelId?: any;
    protected cancelTokens: any[] = [];

    private _has_called_constructor = false;

    protected _cancelable_tokens_construct(
      cancelIdPrefix: string,
      cancelId: any = Math.random()
    ) {
      this.cancelId = cancelIdPrefix + "-" + cancelId;
      this._has_called_constructor = true;
    }

    // constructor() {
    //
    //     this.cancelId = cancelIdPrefix + "-" + cancelId;
    // }

    private guardConstructor() {
      if (!this._has_called_constructor) {
        throw new Error(
          "CancelableTokens has been used before calling constructor"
        );
      }
    }

    /**
     * generate
     *
     * Description:
     * Creates Axios CancelToken to use in your's request config.
     * If request with identical tag already exists, it will be cancelled
     *
     */
    public generate(funcName: any, ...args: any) {
      this.guardConstructor();
      //we are not using canceltokens
      if (!this.cancelId) {
        return;
      }
      let key: any = /^function\s+([\w]+)\s*\(/.exec(
        funcName.toString()
      ) as any;
      key = key ? key[1] : funcName.toString();

      // console.log("__query___", key);
      // console.trace();
      if (args) {
        key += args.join(",");
      }
      if (this.cancelTokens[key]) {
        this.cancel(key);
      }
      this.cancelTokens[key] = axios.CancelToken.source();
      return this.cancelTokens[key].token;
    }

    cancel(key: any) {
      // console.log(`[cancel-tokens] cancelling "${key}"@${this.cancelId}`);
      if (this.cancelTokens[key]) {
        this.cancelTokens[key].cancel();
        delete this.cancelTokens[key];
      }
    }

    cancelAll() {
      this.guardConstructor();
      for (let [key] of Object.entries(this.cancelTokens)) {
        this.cancel(key);
      }
    }
  };
  guardMixinClassInheritance(CancelableTokens, Base1);
  return CancelableTokens;
}

export class CancelTokens extends CancelableTokens(EmptyClass) {
  constructor(cancelIdPrefix: string, cancelId: any = Math.random()) {
    super();
    this._cancelable_tokens_construct(cancelIdPrefix, cancelId);
  }
}
