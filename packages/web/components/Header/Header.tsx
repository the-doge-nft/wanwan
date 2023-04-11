import { observer } from "mobx-react-lite";
import { isDev } from "../../environment/vars";
import { css } from "../../helpers/css";
import AppStore from "../../store/App.store";
import CreateButton from "../Button/CreateButton";
import EllipsesButton from "../Button/EllipsesButton";
import { ButtonSize, ConnectButton } from "../DSL/Button/Button";
import Link, { LinkType } from "../DSL/Link/Link";
import Text, { TextType } from "../DSL/Text/Text";
import Logo from "../Logo/Logo";

const navItems: { name: string; link: string }[] = [];
if (isDev()) {
  navItems.push(
    { name: "dsl", link: "/dsl" },
    { name: "dev-assets", link: "/devAssets" }
  );
}

const Header = observer(() => {
  return (
    <div className={css("flex", "justify-between", "relative")}>
      <div className={css("flex", "gap-2")}>
        <Link
          type={LinkType.Secondary}
          href="/"
          className={css("flex", "items-center", "gap-0.5")}
        >
          <Logo />
        </Link>
        {navItems.map((item) => (
          <Link key={item.name} href={item.link}>
            <Text type={TextType.NoColor}>{item.name}</Text>
          </Link>
        ))}
      </div>
      <div className={css("z-10", "flex", "gap-2", "items-stretch")}>
        {AppStore.auth.isAuthed && <CreateButton />}
        <ConnectButton size={ButtonSize.lg} />
        <EllipsesButton />
      </div>
    </div>
  );
});

export default Header;
