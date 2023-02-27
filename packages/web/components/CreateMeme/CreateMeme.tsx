import { observer } from "mobx-react-lite";
import { css } from "../../helpers/css";
import AppStore from "../../store/App.store";
import CreateMemeStore, { CreateMemeView } from "../../store/CreateMeme.store";
import Button, { Submit } from "../DSL/Button/Button";
import Form from "../DSL/Form/Form";
import MediaInput from "../DSL/Form/MediaInput";
import TextInput from "../DSL/Form/TextInput";
import { required } from "../DSL/Form/validation";
import Text, { TextSize } from "../DSL/Text/Text";

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
        </div>
      </Form>
    );
  }
);

const Success = () => {
  return (
    <div>
      <div className={css("text-center")}>
        <div>
          <code>{`
          ____
        o8%8888,    
      o88%8888888.  
     8'-    -:8888b   
    8'         8888  
   d8.-=. ,==-.:888b  
   >8 \`~\` :\`~\' d8888   
   88         ,88888   
   88b. \`-~  ':88888  
   888b ~==~ .:88888 
   88888o--:':::8888      
   \`88888| :::' 8888b  
   8888^^'       8888b  
  d888           ,%888b.   
 d88%            %%%8--'-.  
/88:.__ ,       _%-' ---  -  
    '''::===..-'   =  --
    `}</code>
        </div>
        <Text size={TextSize.lg}>Meme Created</Text>
      </div>
    </div>
  );
};

export default CreateMeme;
