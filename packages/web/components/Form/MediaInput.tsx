import { observer } from "mobx-react-lite";
import { useCallback, useEffect } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { objectKeys } from "../../helpers/arrays";
import { css } from "../../helpers/css";
import { bytesToSize } from "../../helpers/numberFormatter";
import Button from "../Button/Button";
import { errorToast } from "../Toast/Toast";
import FormControl from "./FormControl";
import { useFormField } from "./useFormField";

export interface FileWithPreview extends File {
  preview: string;
}

export interface MediaInputProps {
  onDropAccepted: (file: FileWithPreview) => void;
  onClear?: () => void;
  renderIsDropActive?: () => any;
  validate?: any;
  disabled?: boolean;
  noClick?: boolean;

  name: string;
  description?: string;
  label?: string;
  value?: FileWithPreview | null;
}

export const MAX_SIZE_MEDIA_BYTES = 2097152;
const acceptedMimeToExtensionMap = {
  "image/jpeg": [".jpeg", ".jpg"],
  "image/png": [".png"],
};

const MediaInput = observer(
  ({
    onDropAccepted,
    onClear,
    renderIsDropActive,
    name,
    validate,
    disabled,
    description,
    label,
    noClick,
    value,
  }: MediaInputProps) => {
    const minHeight = value ? 400 : 200;
    const maxFiles = 1;

    const { input, meta, isRequired } = useFormField(name, validate);
    const isError = meta.error && meta.touched;

    const onDrop = useCallback((acceptedFiles: any) => {
      input.onChange(acceptedFiles);
    }, []);

    const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
      fileRejections.forEach((file) => {
        file.errors.forEach((error) => {
          if (error.code === "file-too-large") {
            errorToast(
              `File must be smaller than ${bytesToSize(MAX_SIZE_MEDIA_BYTES)}`
            );
          } else {
            errorToast(error.message);
          }
        });
      });
    }, []);

    const _onDropAccepted = useCallback((files: File[]) => {
      if (files.length > maxFiles) {
        throw Error("Only 1 file is allowed");
      }
      const file = Object.assign(files[0], {
        preview: URL.createObjectURL(files[0]),
      });
      onDropAccepted(file);
    }, []);

    useEffect(() => {
      input.onChange(value);
    }, [value]);

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
      onDropRejected,
      maxFiles,
      onDropAccepted: _onDropAccepted,
      maxSize: MAX_SIZE_MEDIA_BYTES,
      disabled: disabled,
      accept: acceptedMimeToExtensionMap,
      multiple: false,
      onDrop: onDrop,
      noClick: noClick,
    });

    return (
      <FormControl
        description={description}
        isRequired={isRequired}
        name={name}
        label={label}
      >
        <div className={css("relative", "inline-block", "w-full")}>
          <div
            {...getRootProps()}
            style={{ minHeight }}
            className={css(
              "border-[1px]",
              "border-dashed",
              "flex",
              "relative",
              "justify-center",
              "items-center",
              "overflow-hidden",
              "rounded-sm",
              "p-7",
              {
                "border-red-700": isError && !isDragActive,
                "border-slate-600": !isError && !isDragActive,
                "border-neutral-600": isDragActive,
                "cursor-pointer": !noClick,
                "cursor-default": noClick,
              }
            )}
          >
            {isDragActive && renderIsDropActive && renderIsDropActive()}
            {!isDragActive && !value && (
              <div
                className={css(
                  "flex",
                  "flex-col",
                  "items-center",
                  "text-neutral-700"
                )}
              >
                <div className={css("text-sm")}>
                  accepted:{" "}
                  {objectKeys(acceptedMimeToExtensionMap).map(
                    (mime, index, arr) => {
                      if (index === arr.length - 1) {
                        return (
                          ", " + acceptedMimeToExtensionMap[mime].join(", ")
                        );
                      } else {
                        return acceptedMimeToExtensionMap[mime].join(", ");
                      }
                    }
                  )}
                </div>
                <div className={css("mt-0.5", "text-sm")}>
                  Max Size: {bytesToSize(MAX_SIZE_MEDIA_BYTES)}
                </div>
                <div className={css("mt-5")}>
                  <Button disabled={disabled} onClick={() => open()}>
                    Select File
                  </Button>
                </div>
              </div>
            )}
            {value && (
              <div
                className={css(
                  "bg-contain",
                  "bg-center",
                  "bg-no-repeat",
                  "w-full",
                  "h-full"
                )}
                style={{ background: `url(${value?.preview})`, minHeight }}
              />
            )}
            <input {...getInputProps()} />
          </div>
          {!isDragActive && value && (
            <div className={css("absolute", "top-3", "right-3")}>
              <Button
                onClick={() => {
                  if (onClear) {
                    input.onChange(null);
                    onClear();
                  }
                }}
              >
                x
              </Button>
            </div>
          )}
        </div>
      </FormControl>
    );
  }
);

export default MediaInput;
