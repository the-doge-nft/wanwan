import { computed, makeObservable, observable } from "mobx";
import http from "../services/http";
import { EmptyClass } from "../services/mixins";
import { Navigable } from "../services/mixins/navigable";

export enum CreateMemeView {
  Create = "Create",
  Success = "Success",
}

export default class CreateMemeStore extends Navigable(EmptyClass) {
  @observable
  private file: File | null = null;

  @observable
  isSubmitLoading = false;

  constructor() {
    super();
    makeObservable(this);
    this.currentView = CreateMemeView.Create;
  }

  async onMemeSubmit(values: any) {
    this.isSubmitLoading = true;

    const formData = new FormData();
    if (!this.file) throw new Error("No file");
    formData.append("file", this.file);
    if (values.name) formData.append("name", values.name);
    if (values.description) formData.append("description", values.description);

    await http.post("/meme", formData);
    this.isSubmitLoading = false;
    this.currentView = CreateMemeView.Success;
  }

  onFileDrop(file: File) {
    this.file = file;
  }

  onFileClear() {
    this.file = null;
  }

  @computed
  get title() {
    switch (this.currentView) {
      case CreateMemeView.Create:
        return "Create Meme";
      case CreateMemeView.Success:
        return "Meme Created";
      default:
        return "";
    }
  }
}
