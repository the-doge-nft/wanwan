import { AxiosResponse } from "axios";
import { makeObservable, observable } from "mobx";
import { errorToast } from "../components/DSL/Toast/Toast";
import { bytesToSize } from "../helpers/numberFormatter";
import { Media, Nullable } from "../interfaces";
import Http from "../services/http";
import AppStore from "./App.store";

export default class TipTapEditorToolbarStore {
  @observable
  isLoading = false;

  @observable
  helperText: Nullable<string> = null;

  constructor() {
    makeObservable(this);
  }

  onFileChange(
    targetFiles: FileList,
    onSuccess: (responses: AxiosResponse<Media, any>[]) => void
  ) {
    this.isLoading = true;

    const validFiles = Object.values(targetFiles).filter((file) => {
      if (file.size > AppStore.settings.maxSizeBytes) {
        errorToast(
          "File must be smaller than " +
            bytesToSize(AppStore.settings.maxSizeBytes)
        );
        return false;
      }
      return true;
    });

    this.helperText = `Uploading ${validFiles.length} files`;

    return Promise.all(
      validFiles.map((file) => {
        return this.postNewImage(file);
      })
    )
      .then((responses) => {
        return onSuccess(responses);
      })
      .finally(() => {
        this.isLoading = false;
        this.helperText = null;
      });
  }

  private postNewImage(file: File) {
    const formData = new FormData();
    formData.set("file", file);
    return Http.postMedia(formData);
  }
}
