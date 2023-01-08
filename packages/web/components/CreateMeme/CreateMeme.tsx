import { observer } from "mobx-react-lite";
import { useEffect, useMemo } from "react";
import CreateMemeStore from "../../store/CreateMeme.store";
import { Submit } from "../Button/Button";
import Form from "../Form/Form";
import MediaInput from "../Form/MediaInput";
import TextInput from "../Form/TextInput";
import { required } from "../Form/validation";

const CreateMeme = observer(() => {
  const store = useMemo(() => new CreateMemeStore(), []);
  useEffect(() => {
    store.init();
  }, []);
  return (
    <Form onSubmit={(values) => store.onMemeSubmit(values)}>
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
