import { observer } from "mobx-react-lite";
import AppStore from "../../store/App.store";
import Modal, { ModalProps } from "../DSL/Modal/Modal";

interface SettingsModalProps extends ModalProps {}

const SettingsModal = observer(({}: SettingsModalProps) => {
  return (
    <Modal
      title={"Settings"}
      isOpen={AppStore.modals.isSettingsModalOpen}
      onChange={(isOpen) => (AppStore.modals.isSettingsModalOpen = isOpen)}
    >
      <div>your settings</div>
    </Modal>
  );
});

export default SettingsModal;
