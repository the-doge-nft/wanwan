import { computed, makeObservable, observable } from "mobx";
import { THEME_KEY } from "../components/DSL/Theme";
import { objectKeys } from "../helpers/arrays";
import { MediaRequirements } from "../interfaces";
import Http from "./../services/http";

const ZOOM_KEY = "zoom";

type ColorMode = "light" | "dark";
enum Zoom {
  normal = "100%",
  zoomed = "150%",
}
export default class SettingsStore {
  @observable
  private mediaRequirements: MediaRequirements | null = null;

  @observable
  colorMode = "light";

  @observable
  zoom = Zoom.normal;

  constructor() {
    makeObservable(this);
  }

  init() {
    this.setColorMode(localStorage.getItem(THEME_KEY) as ColorMode & null);
    this.setZoom(localStorage.getItem(ZOOM_KEY) as Zoom & null);
    Http.getMediaRequirements().then(({ data }) => {
      this.mediaRequirements = data;
    });
  }

  setColorMode(colorMode: "light" | "dark" | null) {
    localStorage[THEME_KEY] = colorMode;
    if (
      localStorage[THEME_KEY] === "dark" ||
      (!(THEME_KEY in localStorage) &&
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

  setZoom(zoom: Zoom | null) {
    if (zoom === Zoom.normal || zoom === null) {
      //@ts-ignore
      document.body.style.zoom = Zoom.normal;
      this.zoom = Zoom.normal;
    } else {
      //@ts-ignore
      document.body.style.zoom = Zoom.zoomed;
      this.zoom = Zoom.zoomed;
    }
    localStorage.setItem(ZOOM_KEY, this.zoom);
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

  @computed
  get isZoomed() {
    return this.zoom === Zoom.zoomed;
  }

  toggleColorMode() {
    return this.setColorMode(this.isLightMode ? "dark" : "light");
  }

  toggleZoom() {
    this.setZoom(this.isZoomed ? Zoom.normal : Zoom.zoomed);
  }

  @computed
  get acceptedMimeTypeString() {
    const mimeTypeToExtension = this.mimeTypeToExtension;
    return mimeTypeToExtension
      ? objectKeys(mimeTypeToExtension).join(", ")
      : "";
  }
}
