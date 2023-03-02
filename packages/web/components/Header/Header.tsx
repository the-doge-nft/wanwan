import { observer } from "mobx-react-lite";
import { isDev } from "../../environment/vars";
import { css } from "../../helpers/css";
import AppStore from "../../store/App.store";
import { ButtonSize, ConnectButton, CreateButton } from "../DSL/Button/Button";
import Link, { LinkType } from "../DSL/Link/Link";
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
        {/* {navItems.map((item) => (
          <Link key={item.name} href={item.link}>
            <Text type={TextType.NoColor}>{item.name}</Text>
          </Link>
        ))} */}
        <Link
          type={LinkType.Secondary}
          href="/"
          className={css("flex", "items-center", "gap-0.5")}
        >
          <Logo />
        </Link>
      </div>
      {/* <div
        className={css(
          "absolute",
          "left-1/2",
          "top-1/2",
          "-translate-x-1/2",
          "-translate-y-1/2",
          "font-bold"
        )}
      >
        <Link
          type={LinkType.Secondary}
          href="/"
          className={css("flex", "items-center", "gap-0.5")}
        >
          <Text type={TextType.NoColor}>{env.app.name}</Text>
        </Link>
      </div> */}
      <div className={css("z-10", "flex", "items-center", "gap-2")}>
        {AppStore.auth.isAuthed && <CreateButton />}
        <ConnectButton size={ButtonSize.lg} />
      </div>
    </div>
  );
});

export default Header;
