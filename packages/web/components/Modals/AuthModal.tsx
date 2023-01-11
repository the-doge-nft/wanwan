import { observer } from "mobx-react-lite";
import AppStore from "../../store/App.store";
import { ButtonSize, ConnectButton } from "../DSL/Button/Button";
import Modal from "../DSL/Modal/Modal";

const AuthModal: React.FC = observer(() => {
  return (
    <Modal
      title={"Login"}
      isOpen={AppStore.modals.isAuthModalOpen}
      onChange={(isOpen) => (AppStore.modals.isAuthModalOpen = isOpen)}
    >
      <ConnectButton
        size={ButtonSize.lg}
        onConnectClick={() => (AppStore.modals.isAuthModalOpen = false)}
      />
    </Modal>
  );
});

export default AuthModal;
