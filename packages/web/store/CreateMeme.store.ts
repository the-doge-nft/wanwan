import { computed, makeObservable, observable } from "mobx";
import { Meme, Nullable } from "../interfaces";
import { EmptyClass } from "../services/mixins";
import { Navigable } from "../services/mixins/navigable";
import Http from "./../services/http";
import AppStore from "./App.store";

export enum CreateMemeView {
  Create = "Create",
  Success = "Success",
}

export default class CreateMemeStore extends Navigable(EmptyClass) {
  @observable
  private file: Nullable<File> = null;

  @observable
  meme: Nullable<Meme> = null;

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
    formData.append("file", this.file!);
    if (values.name) {
      formData.append("name", values.name);
    }
    if (values.description) {
      formData.append("description", values.description);
    }

    const { data } = await Http.postMeme(formData);
    this.isSubmitLoading = false;
    this.meme = data;
    this.currentView = CreateMemeView.Success;
    AppStore.events.publish(AppStore.events.events.MEME_CREATED);
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
        return "New meme";
      case CreateMemeView.Success:
        return "You did it";
      default:
        return "";
    }
  }
}
