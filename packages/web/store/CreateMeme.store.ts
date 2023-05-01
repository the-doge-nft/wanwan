import { JSONContent } from "@tiptap/react";
import { action, computed, makeObservable, observable } from "mobx";
import Router from "next/router";
import { FileWithPreview } from "../components/DSL/Form/MediaInput";
import { jsonify } from "../helpers/strings";
import { Nullable } from "../interfaces";
import { EmptyClass } from "../services/mixins";
import { Loadable } from "../services/mixins/loadable";
import { Navigable } from "../services/mixins/navigable";
import Http from "./../services/http";
import AppStore from "./App.store";
import TipTapEditorToolbarStore from "./TipTapEditorToolbar.store";

export enum CreateMemeView {
  Create = "Create",
}

export default class CreateMemeStore extends Navigable(Loadable(EmptyClass)) {
  @observable
  memes: Array<MemeStore> = [];

  constructor() {
    super();
    makeObservable(this);
    this.currentView = CreateMemeView.Create;
  }

  submit() {
    const promises = this.memes.map((meme) => meme.submit());
    return Promise.all(promises).then(() => {
      Router.push(`/profile/${AppStore.auth.address}/memes`);
    });
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
      default:
        return "";
    }
  }

  @computed
  get hasMemes() {
    return this.memes.length > 0;
  }
}

export class MemeStore extends Loadable(EmptyClass) {
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
    super();
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

  submit() {
    const formData = new FormData();
    formData.append("file", this.file);
    if (this.name) {
      formData.append("name", this.name);
    }
    if (this.description) {
      formData.append("description", jsonify(this.description));
    }
    return this.tapWithLoading(() =>
      Http.postMeme(formData).then(() =>
        AppStore.events.publish(AppStore.events.events.MEME_CREATED)
      )
    );
  }
}
