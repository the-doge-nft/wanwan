import { observer } from "mobx-react-lite";
import AppStore from "../../store/App.store";
import AuthModal from "./AuthModal";
import CreateCompetitionModal from "./CreateCompetitionModal";
import CreateMemeModal from "./CreateMemeModal";
import SettingsModal from "./SettingsModal";

const Modals = observer(() => {
  return (
    <>
      {AppStore.modals.isAuthModalOpen && <AuthModal />}
      {AppStore.modals.isCreateMemeModalOpen && <CreateMemeModal />}
      {AppStore.modals.isCreateCompetitionModalOpen && (
        <CreateCompetitionModal />
      )}
      {AppStore.modals.isSettingsModalOpen && <SettingsModal />}
    </>
  );
});

export default Modals;
