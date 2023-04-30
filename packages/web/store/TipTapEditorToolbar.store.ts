import { AxiosResponse } from "axios";
import { makeObservable, observable } from "mobx";
import { Media } from "../interfaces";
import Http from "../services/http";

export default class TipTapEditorToolbarStore {
  @observable
  isLoading = false;

  constructor() {
    makeObservable(this);
  }

  onFileChange(
    targetFiles: FileList,
    onSuccess: (responses: AxiosResponse<Media, any>[]) => void
  ) {
    this.isLoading = true;
    return Promise.all(
      Object.values(targetFiles).map((file) => {
        return this.postNewImage(file);
      })
    )
      .then((responses) => {
        return onSuccess(responses);
      })
      .finally(() => (this.isLoading = false));
  }

  private postNewImage(file: File) {
    const formData = new FormData();
    formData.set("file", file);
    this.isLoading = true;
    return Http.postMedia(formData).finally(() => (this.isLoading = false));
  }
}
