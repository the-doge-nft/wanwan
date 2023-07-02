import { observer } from "mobx-react-lite";
import { css } from "../../helpers/css";
import AppStore from "../../store/App.store";
import CreateButton from "../Button/CreateButton";
import EllipsesButton from "../Button/EllipsesButton";
import { ButtonSize, ConnectButton } from "../DSL/Button/Button";
import Link, { LinkType } from "../DSL/Link/Link";
import Logo from "../Logo/Logo";

const Header = observer(() => {
  return (
    <div
      className={css(
        "flex",
        "justify-between",
        "relative",
        "items-center",
        "gap-4"
      )}
    >
      <div className={css("flex", "gap-2")}>
        <Link
          type={LinkType.Secondary}
          href="/"
          className={css("flex", "items-center", "gap-0.5")}
        >
          <Logo />
        </Link>
      </div>
      <div className={css("z-10", "flex", "gap-2")}>
        {AppStore.auth.isAuthed && <CreateButton />}
        <ConnectButton size={ButtonSize.lg} />
        <EllipsesButton />
      </div>
    </div>
  );
});

export default Header;
