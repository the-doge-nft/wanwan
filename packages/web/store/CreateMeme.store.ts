import { computed, makeObservable, observable } from "mobx";
import { MediaRequirements } from "../interfaces";
import http from "../services/http";

export default class CreateMemeStore {
  @observable
  private file: File | null = null;

  @observable
  private mediaRequirements: MediaRequirements | null = null;

  async init() {
    const { data } = await http.get<MediaRequirements>("/media/requirements");
    this.mediaRequirements = data;
  }

  constructor() {
    makeObservable(this);
  }

  onMemeSubmit(values: any) {
    const formData = new FormData();
    if (!this.file) throw new Error("No file");
    formData.append("file", this.file);
    if (values.name) formData.append("name", values.name);
    if (values.description) formData.append("description", values.description);
    return http.post("/meme", formData);
  }

  onFileDrop(file: File) {
    this.file = file;
  }

  onFileClear() {
    this.file = null;
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
