import { observer } from "mobx-react-lite";
import AppStore from "../../store/App.store";
import AuthModal from "./AuthModal";
import CreateMemeModal from "./CreateMemeModal";

const Modals = observer(() => {
  return (
    <>
      {AppStore.modals.isAuthModalOpen && <AuthModal />}
      {AppStore.modals.isCreateMemeModalOpen && <CreateMemeModal />}
    </>
  );
});

export default Modals;
