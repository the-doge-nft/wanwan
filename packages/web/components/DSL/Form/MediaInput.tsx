import { useCallback, useEffect, useMemo, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { IoCloseOutline } from "react-icons/io5";
import { objectKeys } from "../../../helpers/arrays";
import { css } from "../../../helpers/css";
import { bytesToSize } from "../../../helpers/numberFormatter";
import Button from "../Button/Button";
import { errorToast } from "../Toast/Toast";
import FormControl from "./FormControl";
import { useFormField } from "./useFormField";
import { Validator } from "./validation";

export interface FileWithPreview extends File {
  preview: string;
}

export interface MediaInputProps {
  onDropAccepted?: (file: File) => void;
  onClear?: () => void;
  renderIsDropActive?: () => React.ReactNode;
  validate?: Validator;
  disabled?: boolean;
  noClick?: boolean;
  maxSizeBytes: number;
  acceptedMimeToExtension: { [key: string]: string[] };
  name: string;
  description?: string;
  label?: string;
  value?: File | null;
}

const MediaInput: React.FC<MediaInputProps> = ({
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
  maxSizeBytes,
  acceptedMimeToExtension,
}) => {
  const [preview, setPreview] = useState<string | null>(null);

  const minHeight = preview ? 200 : 200;
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
          errorToast(`File must be smaller than ${bytesToSize(maxSizeBytes)}`);
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
    const file = files[0];
    setPreview(URL.createObjectURL(file));
    if (onDropAccepted) {
      onDropAccepted(file);
    }
  }, []);

  useEffect(() => {
    input.onChange(value);
  }, [value]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDropRejected,
    maxFiles,
    onDropAccepted: _onDropAccepted,
    maxSize: maxSizeBytes,
    disabled: disabled,
    accept: acceptedMimeToExtension,
    multiple: false,
    onDrop: onDrop,
    noClick: noClick,
  });

  const acceptedExtensionsLabel = useMemo(() => {
    const extensions = objectKeys(acceptedMimeToExtension).reduce(
      (acc: any, key) => {
        return [...acc, ...acceptedMimeToExtension[key]];
      },
      []
    );
    return extensions.join(", ");
  }, [acceptedMimeToExtension]);

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
            "flex-col",
            "relative",
            "justify-center",
            "items-center",
            "overflow-hidden",
            "rounded-sm",
            "p-7",
            "hover:border-black",
            "dark:border-neutral-600",
            "dark:hover:border-neutral-400",
            {
              "border-red-800": isError && !isDragActive,
              "border-gray-400": !isError && !isDragActive,
              "border-neutral-600": isDragActive,
              "cursor-pointer": !noClick,
              "cursor-default": noClick,
            }
          )}
        >
          {isDragActive && (
            <>
              {renderIsDropActive && renderIsDropActive()}
              {!renderIsDropActive && (
                <div
                  className={css("text-xs", "text-black", "dark:text-white")}
                >
                  wow
                </div>
              )}
            </>
          )}
          {preview && (
            <div
              className={css(
                "!bg-contain",
                "!bg-center",
                "!bg-no-repeat",
                "w-full",
                "h-full",
                "grow"
              )}
              style={{ background: `url(${preview})` }}
            />
          )}
          {!isDragActive && !preview && (
            <div
              className={css(
                "flex",
                "flex-col",
                "items-center",
                "text-neutral-700",
                "gap-3",
                "mt-3"
              )}
            >
              <div>
                <Button disabled={disabled}>Select File</Button>
              </div>
              <div className={css("text-center", "text-neutral-600")}>
                <div className={css("text-xs")}>
                  accepted: {acceptedExtensionsLabel}
                </div>
                <div className={css("mt-0.5", "text-xs")}>
                  Max Size: {bytesToSize(maxSizeBytes)}
                </div>
              </div>
              <input {...getInputProps()} />
            </div>
          )}
        </div>
        {!isDragActive && preview && (
          <div className={css("absolute", "top-3", "right-3")}>
            <Button
              disabled={disabled}
              onClick={() => {
                input.onChange(null);
                setPreview(null);
                if (onClear) {
                  onClear();
                }
              }}
            >
              <IoCloseOutline size={14} />
            </Button>
          </div>
        )}
      </div>
    </FormControl>
  );
};

export default MediaInput;
