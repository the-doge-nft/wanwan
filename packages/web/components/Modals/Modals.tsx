import { observer } from "mobx-react-lite";
import AuthModal from "./AuthModal";

const Modals = observer(() => {
  return (
    <>
      <AuthModal />
    </>
  );
});

export default Modals;
