import env from "../../environment";
import { isDev } from "../../environment/vars";
import { css } from "../../helpers/css";
import { ButtonSize, ConnectButton } from "../DSL/Button/Button";
import Link, { LinkType } from "../DSL/Link/Link";
import Text, { TextType } from "../DSL/Text/Text";

const navItems: { name: string; link: string }[] = [];
if (isDev()) {
  navItems.push(
    { name: "dsl", link: "/dsl" },
    { name: "dev-assets", link: "/devAssets" }
  );
}

const Header = () => {
  return (
    <div className={css("flex", "justify-between", "relative")}>
      <div className={css("flex", "gap-2")}>
        {navItems.map((item) => (
          <Link key={item.name} href={item.link}>
            <Text type={TextType.NoColor}>{item.name}</Text>
          </Link>
        ))}
      </div>
      <div
        className={css(
          "absolute",
          "left-1/2",
          "top-1/2",
          "-translate-x-1/2",
          "-translate-y-1/2",
          "font-bold"
        )}
      >
        <Link type={LinkType.Secondary} href="/">
          <Text type={TextType.NoColor}>{env.app.name}</Text>
        </Link>
      </div>
      <div className={css("z-10")}>
        <ConnectButton size={ButtonSize.lg} />
      </div>
    </div>
  );
};

export default Header;
