import { computed, makeObservable, observable } from "mobx";
import { MediaRequirements } from "../interfaces";
import http from "../services/http";

type ColorMode = "light" | "dark";
export default class SettingsStore {
  @observable
  private mediaRequirements: MediaRequirements | null = null;

  @observable
  colorMode = "light";

  constructor() {
    makeObservable(this);
  }

  init() {
    this.setColorMode(localStorage.getItem("theme") as ColorMode & null);
    http.get<MediaRequirements>("/media/requirements").then(({ data }) => {
      this.mediaRequirements = data;
    });
  }

  setColorMode(colorMode: "light" | "dark" | null) {
    localStorage.theme = colorMode;
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      this.colorMode = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      this.colorMode = "light";
    }
    document.documentElement.style.colorScheme = this.colorMode;
  }

  @computed
  get maxSizeBytes() {
    return this.mediaRequirements ? this.mediaRequirements.maxSizeBytes : 0;
  }

  @computed
  get mimeTypeToExtension() {
    return this.mediaRequirements
      ? this.mediaRequirements.mimeTypeToExtensionMap
      : null;
  }

  @computed
  get isLightMode() {
    return this.colorMode === "light";
  }
}
