import { observer } from "mobx-react-lite";
import AppStore from "../../store/App.store";
import AuthModal from "./AuthModal";
import CreateCompetitionModal from "./CreateCompetitionModal";
import CreateMemeModal from "./CreateMemeModal";
import ProfileSettingsModal from "./ProfileSettingsModal";

const Modals = observer(() => {
  return (
    <>
      {AppStore.modals.isAuthModalOpen && <AuthModal />}
      {AppStore.modals.isCreateMemeModalOpen && <CreateMemeModal />}
      {AppStore.modals.isCreateCompetitionModalOpen && (
        <CreateCompetitionModal />
      )}
      {AppStore.modals.isSettingsModalOpen && <ProfileSettingsModal />}
    </>
  );
});

export default Modals;
