import { JSONContent } from "@tiptap/react";
import { action, computed, makeObservable, observable } from "mobx";
import { FileWithPreview } from "../../components/DSL/Form/MediaInput";
import { jsonify } from "../../helpers/strings";
import Http from "../../services/http";
import { EmptyClass } from "../../services/mixins";
import { Loadable } from "../../services/mixins/loadable";
import TipTapEditorToolbarStore from "../TipTapEditorToolbar.store";

export default class MemeStore extends Loadable(EmptyClass) {
  @observable
  file: FileWithPreview;

  @observable
  name = "";

  @observable
  description?: JSONContent = undefined;

  @observable
  toolbarStore = new TipTapEditorToolbarStore();

  @observable
  showName = false;

  @observable
  showDescription = false;

  @observable
  isSubmited = false;

  constructor(file: FileWithPreview) {
    super();
    makeObservable(this);
    this.file = file;
    this.isLoading = false;
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
      this.description = undefined;
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
      Http.postMeme(formData).then((response) => {
        this.isSubmited = true;
        return response;
      })
    );
  }

  @computed
  get isDisabled() {
    return this.isLoading || this.isSubmited;
  }
}
