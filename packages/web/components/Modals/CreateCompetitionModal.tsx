import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import AppStore from "../../store/App.store";
import CreateCompetitionStore from "../../store/CreateCompetition.store";
import CreateCompetition from "../CreateCompetition/CreateCompetition";
import Modal from "../DSL/Modal/Modal";

const CreateCompetitionModal = observer(() => {
  const store = useMemo(() => new CreateCompetitionStore(), []);
  return (
    <Modal
      title={store.title}
      isOpen={AppStore.modals.isCreateCompetitionModalOpen}
      onChange={(isOpen) =>
        (AppStore.modals.isCreateCompetitionModalOpen = isOpen)
      }
    >
      <CreateCompetition store={store} />
    </Modal>
  );
});

export default CreateCompetitionModal;