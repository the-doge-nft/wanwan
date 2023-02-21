import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import AppStore from "../../store/App.store";
import CreateMemeStore from "../../store/CreateMeme.store";
import CreateMeme from "../CreateMeme/CreateMeme";
import Modal from "../DSL/Modal/Modal";

const CreateMemeModal = observer(() => {
  const store = useMemo(() => new CreateMemeStore(), []);
  return (
    <Modal
      title={store.title}
      isOpen={AppStore.modals.isCreateMemeModalOpen}
      onChange={(isOpen) => (AppStore.modals.isCreateMemeModalOpen = isOpen)}
    >
      <CreateMeme store={store} />
    </Modal>
  );
});

export default CreateMemeModal;
