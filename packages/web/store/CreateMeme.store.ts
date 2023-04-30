import { JSONContent } from "@tiptap/react";
import { action, computed, makeObservable, observable } from "mobx";
import Router from "next/router";
import { FileWithPreview } from "../components/DSL/Form/MediaInput";
import { Nullable } from "../interfaces";
import { EmptyClass } from "../services/mixins";
import { Navigable } from "../services/mixins/navigable";
import Http from "./../services/http";
import AppStore from "./App.store";
import TipTapEditorToolbarStore from "./TipTapEditorToolbar.store";

export enum CreateMemeView {
  Create = "Create",
  Success = "Success",
}

export default class CreateMemeStore extends Navigable(EmptyClass) {
  @observable
  memes: Array<MemeStore> = [];

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
    AppStore.events.publish(AppStore.events.events.MEME_CREATED);
    Router.push(`/meme/${data.id}`);
  }

  onDropAccepted(files: Array<File>) {
    const filesWithPreview: FileWithPreview[] = files.map((file) => {
      return Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
    });
    filesWithPreview.forEach((file) => this.memes.push(new MemeStore(file)));
  }

  @action
  removeFile(index: number) {
    this.memes.splice(index, 1);
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
  get hasMemes() {
    return this.memes.length > 0;
  }
}

export class MemeStore {
  @observable
  file: FileWithPreview;

  @observable
  name = "";

  @observable
  description: Nullable<JSONContent> = null;

  @observable
  toolbarStore = new TipTapEditorToolbarStore();

  @observable
  showName = false;

  @observable
  showDescription = false;

  constructor(file: FileWithPreview) {
    makeObservable(this);
    this.file = file;
  }

  @action
  toggleShowName() {
    this.showName = !this.showName;
    if (!this.showName) {
      this.name = "";
    }
  }

  @action
  toggleShowDescription() {
    this.showDescription = !this.showDescription;
    if (!this.showDescription) {
      this.description = null;
    }
  }
}
