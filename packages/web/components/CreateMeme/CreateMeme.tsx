import { observer } from "mobx-react-lite";
import { ReactNode } from "react";
import {
  RedditIcon,
  RedditShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "react-share";
import { getBaseUrl } from "../../environment/vars";
import { css } from "../../helpers/css";
import AppStore from "../../store/App.store";
import CreateMemeStore, { CreateMemeView } from "../../store/CreateMeme.store";
import AspectRatio from "../DSL/AspectRatio/AspectRatio";
import Button, { Submit } from "../DSL/Button/Button";
import Form from "../DSL/Form/Form";
import MediaInput from "../DSL/Form/MediaInput";
import TextInput from "../DSL/Form/TextInput";
import { required } from "../DSL/Form/validation";
import Text, { TextSize } from "../DSL/Text/Text";

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
    <Form onSubmit={(values) => store.onMemeSubmit(values)}>
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
    </Form>
  );
});

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
