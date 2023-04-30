import { observer } from "mobx-react-lite";
import Image from "next/image";
import { ReactNode, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { IoCloseOutline } from "react-icons/io5";
import {
  RedditIcon,
  RedditShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "react-share";
import { getBaseUrl } from "../../environment/vars";
import { objectKeys } from "../../helpers/arrays";
import { css } from "../../helpers/css";
import AppStore from "../../store/App.store";
import CreateMemeStore, { CreateMemeView } from "../../store/CreateMeme.store";
import AspectRatio from "../DSL/AspectRatio/AspectRatio";
import Form from "../DSL/Form/Form";
import { FileWithPreview } from "../DSL/Form/MediaInput";
import TextInput from "../DSL/Form/TextInput";
import Pane from "../DSL/Pane/Pane";
import Text, { TextSize, TextType } from "../DSL/Text/Text";

const CreateMeme: React.FC<{
  store: CreateMemeStore;
  formButtons?: ReactNode;
}> = observer(({ store, formButtons }) => {
  return (
    <>
      {store.currentView === CreateMemeView.Create && (
        <CreateMemeForm store={store} formButtons={formButtons} />
      )}
      {store.currentView === CreateMemeView.Success && (
        <Success store={store} />
      )}
    </>
  );
});

const CreateMemeForm: React.FC<{
  store: CreateMemeStore;
  formButtons?: ReactNode;
}> = observer(({ store, formButtons }) => {
  return (
    <>
      {/* <Form onSubmit={(values) => store.onMemeSubmit(values)}>
        <div className={css("flex", "flex-col", "gap-2")}>
          <TextInput
            block
            name={"name"}
            label={"Name"}
            disabled={store.isSubmitLoading}
          />
          <TextInput
            block
            name={"description"}
            label={"Description"}
            disabled={store.isSubmitLoading}
          />
          {AppStore.settings.mimeTypeToExtension && (
            <MediaInput
              label={"Media"}
              name={"file"}
              validate={required}
              onDropAccepted={(file) => store.onFileDrop(file)}
              onClear={() => store.onFileClear()}
              maxSizeBytes={AppStore.settings.maxSizeBytes}
              acceptedMimeToExtension={AppStore.settings.mimeTypeToExtension}
              disabled={store.isSubmitLoading}
            />
          )}
          {formButtons && formButtons}
          {!formButtons && (
            <div className={css("mt-4", "flex", "gap-2")}>
              <Submit block isLoading={store.isSubmitLoading} />
              <Button
                block
                disabled={store.isSubmitLoading}
                onClick={() => (AppStore.modals.isCreateMemeModalOpen = false)}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </Form> */}
      <div className={css("flex", "flex-col", "gap-4")}>
        {store.hasFiles && (
          <div
            className={css("grid", "grid-cols-1", "md:grid-cols-2", "gap-4")}
          >
            {store.files.map((file, index) => (
              <MemeForm
                key={`meme-form-input-${index}`}
                store={store}
                file={file}
                onRemove={() => store.removeFile(index)}
              />
            ))}
          </div>
        )}
        {AppStore.settings.mimeTypeToExtension && (
          <MemeInput
            store={store}
            maxSizeBites={AppStore.settings.maxSizeBytes}
            acceptedMimeToExtension={AppStore.settings.mimeTypeToExtension}
            title={store.hasFiles ? "+ Add more" : "Drop memes for money"}
          />
        )}
      </div>
    </>
  );
});

interface MemeFormProps {
  file: FileWithPreview;
  store: CreateMemeStore;
  onRemove: () => void;
}

const MemeForm = ({ file, onRemove }: MemeFormProps) => {
  return (
    <Pane
      key={file.name}
      // title={}
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
          alt={file.name}
          src={file.preview}
          fill
          className={css("object-contain")}
        />
      </div>
      <Form onSubmit={async () => {}}>
        <TextInput name={`text-input`} label={"Name"} block />
      </Form>
    </Pane>
  );
};

interface MemeInputProps {
  store: CreateMemeStore;
  maxSizeBites: number;
  acceptedMimeToExtension: { [key: string]: string[] };
  title: string;
}

const MemeInput = observer(
  ({ store, maxSizeBites, acceptedMimeToExtension, title }: MemeInputProps) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDropAccepted: (files) => store.onDropAccepted(files),
      multiple: true,
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
            <Text size={TextSize.xs} type={TextType.Grey}>
              accepted: {acceptedExtensionsLabel}
            </Text>
          </div>
        )}
        <input {...getInputProps()} />
      </div>
    );
  }
);

const Success: React.FC<{ store: CreateMemeStore }> = observer(({ store }) => {
  return (
    <div>
      <div
        className={css(
          "text-center",
          "flex",
          "items-center",
          "gap-2",
          "justify-center"
        )}
      >
        <Text>~~~</Text>
        <Text size={TextSize.lg}>Meme Created</Text>
        <Text>~~~</Text>
      </div>
      <div className={css("mt-2")}>
        <AspectRatio
          className={css("bg-contain", "bg-no-repeat", "bg-center")}
          ratio={`${store.meme?.media.width}/${store.meme?.media.height}`}
          style={{ backgroundImage: `url(${store.meme?.media.url})` }}
        />
      </div>
      <div>
        <div
          className={css(
            "flex",
            "items-center",
            "justify-center",
            "gap-2",
            "mt-4"
          )}
        >
          <TwitterShareButton
            title={"I just posted a meme on wanwan"}
            url={getBaseUrl() + `/meme/` + store.meme!.id}
          >
            <TwitterIcon size={20} />
          </TwitterShareButton>
          <RedditShareButton
            title={"I just posted a meme on wanwan"}
            url={getBaseUrl() + `/meme/` + store.meme!.id}
          >
            <RedditIcon size={20} />
          </RedditShareButton>
        </div>
      </div>
    </div>
  );
});

export default CreateMeme;
