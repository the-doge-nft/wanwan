import { observer } from "mobx-react-lite";
import { useEffect, useMemo } from "react";
import { css } from "../../helpers/css";
import CreateMemeStore from "../../store/CreateMeme.store";
import { Submit } from "../dsl/Button/Button";
import Form from "../DSL/Form/Form";
import MediaInput from "../DSL/Form/MediaInput";
import TextInput from "../DSL/Form/TextInput";
import { required } from "../dsl/Form/validation";

const CreateMeme = observer(() => {
  const store = useMemo(() => new CreateMemeStore(), []);
  useEffect(() => {
    store.init();
  }, []);
  return (
    <Form
      onSubmit={(values) => store.onMemeSubmit(values)}
      className={css("border-[1px]", "border-slate-500", "p-2")}
    >
      <div>Create meme</div>
      <TextInput name={"name"} label={"Name"} />
      <TextInput name={"description"} label={"Description"} />
      {store.mimeTypeToExtension && (
        <MediaInput
          name={"file"}
          validate={required}
          onDropAccepted={(file) => store.onFileDrop(file)}
          onClear={() => store.onFileClear()}
          maxSizeBytes={store.maxSizeBytes}
          acceptedMimeToExtension={store.mimeTypeToExtension}
        />
      )}
      <Submit />
    </Form>
  );
});

export default CreateMeme;
