import { observer } from "mobx-react-lite";
import { css } from "../../helpers/css";
import AppStore from "../../store/App.store";
import { ButtonSize, ConnectButton } from "../DSL/Button/Button";
import Modal from "../DSL/Modal/Modal";
import Text, { TextSize } from "../DSL/Text/Text";

const AuthModal: React.FC = observer(() => {
  return (
    <Modal
      title={"Login"}
      isOpen={AppStore.modals.isAuthModalOpen}
      onChange={(isOpen) => (AppStore.modals.isAuthModalOpen = isOpen)}
    >
      <div className={css("text-center", "mb-7", "mt-4")}>
        <Text size={TextSize.sm} bold>
          Connect your wallet
        </Text>
      </div>
      <ConnectButton
        block
        size={ButtonSize.lg}
        onConnectClick={() => (AppStore.modals.isAuthModalOpen = false)}
      />
    </Modal>
  );
});

export default AuthModal;
