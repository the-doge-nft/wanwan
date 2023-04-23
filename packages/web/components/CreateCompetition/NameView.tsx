import { observer } from "mobx-react-lite";
import { css } from "../../helpers/css";
import AppStore from "../../store/App.store";
import { Submit } from "../DSL/Button/Button";
import Form from "../DSL/Form/Form";
import MediaInput from "../DSL/Form/MediaInput";
import TextInput from "../DSL/Form/TextInput";
import { required } from "../DSL/Form/validation";
import { CompetitionStoreProp } from "./CreateCompetition";

const NameView = observer(({ store }: CompetitionStoreProp) => {
  return (
    <Form onSubmit={async (values: any) => store.onNameSubmit(values)}>
      <div className={css("flex", "flex-col", "gap-2")}>
        <TextInput
          block
          label={"Name"}
          name={"name"}
          description={"What should it be named?"}
          validate={required}
          value={store.name}
          onChange={(val) => (store.name = val)}
        />
        {AppStore.settings.mimeTypeToExtension && (
          <MediaInput
            label={"Cover Image"}
            name={"file"}
            onDropAccepted={(file) => store.onCoverFileAccepted(file)}
            onClear={() => store.onCoverFileClear()}
            maxSizeBytes={AppStore.settings.maxSizeBytes}
            acceptedMimeToExtension={AppStore.settings.mimeTypeToExtension}
          />
        )}
        <Submit block>Next</Submit>
      </div>
    </Form>
  );
});

export default NameView;
