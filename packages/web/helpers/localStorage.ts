class LocalStorageClass {
  PARSE_JSON = "parse-json";
  PARSE_STRING = "parse-string";

  private get ls() {
    return window.localStorage;
  }

  public setItem(key: string, value: any) {
    if (value === undefined || value === null) {
      return this.removeItem(key);
    }
    if (typeof value === "object") {
      value = JSON.stringify(value);
    }
    return this.ls.setItem(key, value);
  }

  public removeItem(key: string) {
    return this.ls.removeItem(key);
  }

  public getItem(key: string, parse: string, defaultValue: any): any {
    const item = this.ls.getItem(key);
    if (!item) {
      return defaultValue;
    }
    try {
      switch (parse) {
        case LocalStorage.PARSE_JSON:
          return JSON.parse(item);
        case LocalStorage.PARSE_STRING:
          return item.toString();
        default:
          break;
      }
    } catch (e) {
      console.error(e);
      return defaultValue;
    }
    return item;
  }
}
const LocalStorage = new LocalStorageClass();
export default LocalStorage;
