import { makeObservable, observable } from "mobx";
import http from "../services/http";

export default class ProfileStore {
  @observable
  file: File | null = null;

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
}
