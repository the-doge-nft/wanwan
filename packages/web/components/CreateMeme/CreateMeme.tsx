import { observer } from "mobx-react-lite";
import Image from "next/image";
import { useCallback, useMemo } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { IoCloseOutline } from "react-icons/io5";
import { objectKeys } from "../../helpers/arrays";
import { css } from "../../helpers/css";
import { bytesToSize } from "../../helpers/numberFormatter";
import AppStore from "../../store/App.store";
import CreateMemeStore from "../../store/CreateMeme/CreateMeme.store";
import MemeStore from "../../store/CreateMeme/Meme.store";
import Button, { ButtonSize, ButtonType } from "../DSL/Button/Button";
import Form from "../DSL/Form/Form";
import { FormLabel } from "../DSL/Form/FormControl";
import TextInput from "../DSL/Form/TextInput";
import Pane from "../DSL/Pane/Pane";
import Text, { TextSize, TextType } from "../DSL/Text/Text";
import { errorToast } from "../DSL/Toast/Toast";
import TipTapEditor from "../TipTapEditor/TipTapEditor";

interface CreateMemeProps {
  store: CreateMemeStore;
  max?: number;
  label?: string;
}

const CreateMeme = observer(({ store, max, label }: CreateMemeProps) => {
  return (
    <div className={css("flex", "flex-col", "gap-4")}>
      {store.hasMemes && (
        <div
          className={css("grid", "grid-cols-1", "gap-4", {
            "md:grid-cols-2": store.memes.length > 1,
          })}
        >
          {store.memes.map((memeStore, index) => (
            <MemeDetails
              key={`meme-form-input-${index}`}
              store={memeStore}
              onRemove={() => store.removeFile(index)}
            />
          ))}
        </div>
      )}
      {AppStore.settings.mimeTypeToExtension && (
        <div className={css({ hidden: max === 1 && store.memes.length > 0 })}>
          <MemeInput
            maxFiles={max}
            store={store}
            maxSizeBytes={AppStore.settings.maxSizeBytes}
            acceptedMimeToExtension={AppStore.settings.mimeTypeToExtension}
            title={
              store.hasMemes
                ? "+ Add more"
                : `Drop meme${!max || max > 1 ? "s" : ""}`
            }
          />
        </div>
      )}
      {store.hasMemes && (
        <Button onClick={() => store.submit()} isLoading={store.isLoading}>
          {label || "Submit"}
        </Button>
      )}
    </div>
  );
});

interface MemeDetailsProps {
  store: MemeStore;
  onRemove: () => void;
}

const MemeDetails = observer(({ store, onRemove }: MemeDetailsProps) => {
  return (
    <Pane
      key={store.file.name}
      title={store.name}
      rightOfTitle={
        <button
          disabled={store.isDisabled}
          onClick={() => onRemove()}
          className={css(
            "dark:text-white",
            "text-black",
            "border-[1px]",
            "dark:border-white",
            "border-black"
          )}
        >
          <Text>
            <IoCloseOutline size={18} />
          </Text>
        </button>
      }
    >
      <div className={css("relative", "w-full", "h-[200px]")}>
        <Image
          fill
          alt={store.file.name}
          src={store.file.preview}
          className={css("object-contain")}
        />
        {/* {store.isLoading && (
          <div className={css("z-10")}>
            <Spinner size={SpinnerSize.lg} />
          </div>
        )} */}
        {/* {store.isSubmited && (
          <div>
            <Text type={TextType.Grey}>{"( ͡⏿ ͜ʖ ͡⏿)"}</Text>
          </div>
        )} */}
      </div>
      <Form
        onSubmit={async () => {}}
        className={css("flex", "flex-col", "gap-2", "mt-2", "items-start")}
      >
        {store.showName && (
          <div className={css("flex", "items-center", "gap-2", "w-full")}>
            <TextInput
              leftOfInput={
                <Button
                  type={ButtonType.Grey}
                  size={ButtonSize.xs}
                  disabled={store.isLoading || store.isSubmited}
                  onClick={() => store.toggleShowName()}
                >
                  <AiOutlineMinus size={12} />
                </Button>
              }
              block
              name={`text-input`}
              label={"Name"}
              value={store.name}
              onChange={(value) => (store.name = value)}
              disabled={store.isDisabled}
            />
          </div>
        )}
        {!store.showName && (
          <span
            className={css("inline-flex", "items-center", "gap-1", "group")}
          >
            <Button
              type={ButtonType.Grey}
              size={ButtonSize.xs}
              onClick={() => store.toggleShowName()}
              disabled={store.isLoading || store.isSubmited}
            >
              <div className={css("flex", "items-center", "gap-0.5")}>
                <AiOutlinePlus size={15} />
                name
              </div>
            </Button>
          </span>
        )}
        {store.showDescription && (
          <div className={css("flex", "items-center", "gap-2", "w-full")}>
            <div className={css("grow")}>
              <FormLabel>Description</FormLabel>
              <div className={css("flex", "items-start", "gap-2")}>
                <div className={css("mt-1")}>
                  <Button
                    type={ButtonType.Grey}
                    size={ButtonSize.xs}
                    disabled={store.isLoading || store.isSubmited}
                    onClick={() => store.toggleShowDescription()}
                  >
                    <AiOutlineMinus size={12} />
                  </Button>
                </div>
                <div className={css("grow")}>
                  <TipTapEditor
                    content={store.description ? store.description : ""}
                    onUpdate={(json) => (store.description = json)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {!store.showDescription && (
          <span className={css("group")}>
            <Button
              type={ButtonType.Grey}
              size={ButtonSize.xs}
              disabled={store.isLoading || store.isSubmited}
              onClick={() => store.toggleShowDescription()}
            >
              <div className={css("flex", "items-center", "gap-0.5")}>
                <AiOutlinePlus size={15} />
                description
              </div>
            </Button>
          </span>
        )}
      </Form>
    </Pane>
  );
});

interface MemeInputProps {
  store: CreateMemeStore;
  maxSizeBytes: number;
  acceptedMimeToExtension: { [key: string]: string[] };
  title: string;
  maxFiles?: number;
}

const MemeInput = observer(
  ({
    store,
    maxSizeBytes: maxSizeBytes,
    acceptedMimeToExtension,
    title,
    maxFiles,
  }: MemeInputProps) => {
    const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
      fileRejections.forEach((file) => {
        file.errors.forEach((error) => {
          if (error.code === "file-too-large") {
            errorToast(
              `File must be smaller than ${bytesToSize(maxSizeBytes)}`
            );
          } else {
            errorToast(error.message);
          }
        });
      });
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDropAccepted: (files) => store.onDropAccepted(files),
      multiple: maxFiles !== 1,
      maxSize: maxSizeBytes,
      maxFiles: maxFiles || 1000,
      onDropRejected,
      accept: acceptedMimeToExtension,
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
      <div
        {...getRootProps()}
        className={css(
          "border-[1px]",
          "border-dashed",
          "border-neutral-400",
          "flex",
          "flex-col",
          "relative",
          "justify-center",
          "items-center",
          "overflow-hidden",
          "rounded-sm",
          "hover:border-black",
          "dark:border-neutral-600",
          "dark:hover:border-neutral-400",
          "cursor-pointer",
          {
            "md:min-h-[80px] p-4": store.hasMemes,
            "md:min-h-[200px] p-7": !store.hasMemes,
          }
        )}
      >
        {isDragActive && <Text>wow</Text>}
        {!isDragActive && (
          <div className={css("flex", "flex-col", "items-center", "gap-2")}>
            <Text>{title}</Text>
            {!store.hasMemes && (
              <div>
                <Text size={TextSize.xs} type={TextType.Grey}>
                  accepted: {acceptedExtensionsLabel}
                </Text>
                <div className={css("text-xs", "text-center")}>
                  <Text size={TextSize.xs} type={TextType.Grey}>
                    Max Size: {bytesToSize(maxSizeBytes)}
                  </Text>
                </div>
              </div>
            )}
          </div>
        )}
        <input {...getInputProps()} />
      </div>
    );
  }
);

export default CreateMeme;
