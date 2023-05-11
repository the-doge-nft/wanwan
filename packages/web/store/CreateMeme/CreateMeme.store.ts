import { action, computed, makeObservable, observable } from "mobx";
import { FileWithPreview } from "../../components/DSL/Form/MediaInput";
import { Meme } from "../../interfaces";
import { EmptyClass } from "../../services/mixins";
import { Loadable } from "../../services/mixins/loadable";
import { Navigable } from "../../services/mixins/navigable";
import AppStore from "../App.store";
import MemeStore from "./Meme.store";

export enum CreateMemeView {
  Create = "Create",
}

export default class CreateMemeStore extends Navigable(Loadable(EmptyClass)) {
  @observable
  memes: Array<MemeStore> = [];

  @observable
  private memeReceipts: Array<Meme> = [];

  constructor(private onSuccess?: (memes: Array<Meme>) => void) {
    super();
    makeObservable(this);
    this.isLoading = false;
    this.currentView = CreateMemeView.Create;
  }

  async submit() {
    this.isLoading = true;
    const promises = this.memes.map((meme) => meme.submit());
    const responses = await Promise.all(promises);
    responses.forEach(({ data: receipt }) => this.memeReceipts.push(receipt));
    AppStore.events.publish(AppStore.events.events.MEME_CREATED);
    this.onSuccess && this.onSuccess(this.memeReceipts);
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
