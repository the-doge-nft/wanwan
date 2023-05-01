import { EditorContent } from "@tiptap/react";
import { observer } from "mobx-react-lite";
import Image from "next/image";
import { useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { IoCloseOutline } from "react-icons/io5";
import { objectKeys } from "../../helpers/arrays";
import { css } from "../../helpers/css";
import { bytesToSize } from "../../helpers/numberFormatter";
import AppStore from "../../store/App.store";
import CreateMemeStore, { MemeStore } from "../../store/CreateMeme.store";
import Button from "../DSL/Button/Button";
import Form from "../DSL/Form/Form";
import { FormLabel } from "../DSL/Form/FormControl";
import TextInput from "../DSL/Form/TextInput";
import Pane from "../DSL/Pane/Pane";
import Spinner, { SpinnerSize } from "../DSL/Spinner/Spinner";
import Text, { TextSize, TextType } from "../DSL/Text/Text";
import { useTipTapEditor } from "../TipTapEditor/TipTapEditor";
import TipTapEditorToolbar from "../TipTapEditor/TipTapEditorToolbar";

const CreateMeme: React.FC<{
  store: CreateMemeStore;
}> = observer(({ store }) => {
  return (
    <div className={css("flex", "flex-col", "gap-4")}>
      {store.hasMemes && (
        <div className={css("grid", "grid-cols-1", "md:grid-cols-2", "gap-4")}>
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
        <MemeInput
          store={store}
          maxSizeBytes={AppStore.settings.maxSizeBytes}
          acceptedMimeToExtension={AppStore.settings.mimeTypeToExtension}
          title={store.hasMemes ? "+ Add more" : "Drop memes for money"}
        />
      )}
      {store.hasMemes && <Button onClick={() => store.submit()}>Submit</Button>}
    </div>
  );
});

interface MemeDetailsProps {
  store: MemeStore;
  onRemove: () => void;
}

const MemeDetails = observer(({ store, onRemove }: MemeDetailsProps) => {
  const editor = useTipTapEditor(
    store.description ? store.description : "",
    true
  );
  return (
    <Pane
      key={store.file.name}
      title={store.name}
      rightOfTitle={
        <button
          onClick={() => onRemove()}
          className={css("text-white", "border-[1px]", "border-white")}
        >
          <Text>
            <IoCloseOutline size={18} />
          </Text>
        </button>
      }
    >
      <div className={css("relative", "w-full", "h-[300px]")}>
        <Image
          alt={store.file.name}
          src={store.file.preview}
          fill
          className={css("object-contain")}
        />
        {store.isLoading && <Spinner size={SpinnerSize.lg} />}
      </div>
      <Form
        onSubmit={async () => {}}
        className={css("flex", "flex-col", "gap-2", "mt-2", "items-start")}
      >
        {store.showName && (
          <div className={css("flex", "items-center", "gap-2", "w-full")}>
            <TextInput
              leftOfInput={
                <Button onClick={() => store.toggleShowName()}>
                  <AiOutlineMinus size={12} />
                </Button>
              }
              block
              name={`text-input`}
              label={"Name"}
              value={store.name}
              onChange={(value) => (store.name = value)}
            />
          </div>
        )}
        {!store.showName && (
          <Button onClick={() => store.toggleShowName()}>
            <div className={css("flex", "items-center", "gap-0.5")}>
              <AiOutlinePlus size={15} />
              <Text>name</Text>
            </div>
          </Button>
        )}
        {store.showDescription && (
          <div className={css("flex", "items-center", "gap-2", "w-full")}>
            <div className={css("grow")}>
              <FormLabel>Description</FormLabel>
              <div className={css("flex", "items-start", "gap-2")}>
                <div className={css("mt-1")}>
                  <Button onClick={() => store.toggleShowDescription()}>
                    <AiOutlineMinus size={12} />
                  </Button>
                </div>
                <div className={css("grow")}>
                  <EditorContent editor={editor} />
                </div>
              </div>
              {editor && (
                <TipTapEditorToolbar
                  store={store.toolbarStore}
                  editor={editor}
                />
              )}
            </div>
          </div>
        )}
        {!store.showDescription && (
          <Button onClick={() => store.toggleShowDescription()}>
            <div className={css("flex", "items-center", "gap-0.5")}>
              <AiOutlinePlus size={15} />
              <Text>description</Text>
            </div>
          </Button>
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
}

const MemeInput = observer(
  ({
    store,
    maxSizeBytes: maxSizeBytes,
    acceptedMimeToExtension,
    title,
  }: MemeInputProps) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDropAccepted: (files) => store.onDropAccepted(files),
      multiple: true,
      maxSize: maxSizeBytes,
      maxFiles: 100,
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
          "md:min-h-[200px]",
          "cursor-pointer"
        )}
      >
        {isDragActive && <Text>wow</Text>}
        {!isDragActive && (
          <div className={css("flex", "flex-col", "items-center", "gap-2")}>
            <Text>{title}</Text>
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
          </div>
        )}
        <input {...getInputProps()} />
      </div>
    );
  }
);

export default CreateMeme;
