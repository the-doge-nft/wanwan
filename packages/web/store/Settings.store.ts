import { computed, makeObservable, observable } from "mobx";
import { MediaRequirements } from "../interfaces";
import http from "../services/http";
export default class SettingsStore {
  @observable
  private mediaRequirements: MediaRequirements | null = null;

  constructor() {
    makeObservable(this);
  }

  init() {
    http.get<MediaRequirements>("/media/requirements").then(({ data }) => {
      this.mediaRequirements = data;
    });
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
}
