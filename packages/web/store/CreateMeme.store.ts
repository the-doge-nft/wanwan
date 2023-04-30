import { action, computed, makeObservable, observable } from "mobx";
import Router from "next/router";
import { FileWithPreview } from "../components/DSL/Form/MediaInput";
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
  files: Array<FileWithPreview> = [];

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
    // formData.append("file", this.files!);
    if (values.name) {
      formData.append("name", values.name);
    }
    if (values.description) {
      formData.append("description", values.description);
    }

    const { data } = await Http.postMeme(formData);
    this.isSubmitLoading = false;
    this.meme = data;
    AppStore.events.publish(AppStore.events.events.MEME_CREATED);
    Router.push(`/meme/${data.id}`);
  }

  onDropAccepted(files: Array<File>) {
    const filesWithPreview: FileWithPreview[] = files.map((file) => {
      return Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
    });
    this.files = this.files.concat(filesWithPreview);
    console.log("DROP ACCEPTED", files);
  }

  onFileClear() {
    this.files = [];
  }

  @action
  removeFile(index: number) {
    this.files.splice(index, 1);
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

  @computed
  get hasFiles() {
    return this.files.length > 0;
  }
}
