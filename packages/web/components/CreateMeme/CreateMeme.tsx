import { observer } from "mobx-react-lite";
import { css } from "../../helpers/css";
import AppStore from "../../store/App.store";
import CreateMemeStore, { CreateMemeView } from "../../store/CreateMeme.store";
import { Submit } from "../DSL/Button/Button";
import Form from "../DSL/Form/Form";
import MediaInput from "../DSL/Form/MediaInput";
import TextInput from "../DSL/Form/TextInput";
import { required } from "../DSL/Form/validation";

const CreateMeme: React.FC<{ store: CreateMemeStore }> = observer(
  ({ store }) => {
    return (
      <>
        {store.currentView === CreateMemeView.Create && (
          <CreateMemeForm store={store} />
        )}
        {store.currentView === CreateMemeView.Success && <Success />}
      </>
    );
  }
);

const CreateMemeForm: React.FC<{ store: CreateMemeStore }> = observer(
  ({ store }) => {
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
          <div className={css("mt-4")}>
            <Submit block isLoading={store.isSubmitLoading} />
          </div>
        </div>
      </Form>
    );
  }
);

const Success = () => {
  return <div>Success!</div>;
};

export default CreateMeme;
