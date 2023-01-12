import env from "../../environment";
import { isDev } from "../../environment/vars";
import { css } from "../../helpers/css";
import { ConnectButton } from "../DSL/Button/Button";
import Link, { LinkType } from "../DSL/Link/Link";

const navItems: { name: string; link: string }[] = [];
if (isDev()) {
  navItems.push({ name: "dsl", link: "/dsl" });
}

const Header = () => {
  return (
    <div className={css("flex", "justify-between", "relative")}>
      <div className={css("flex", "gap-2")}>
        {navItems.map((item) => (
          <Link key={item.name} href={item.link}>
            {item.name}
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
          {env.app.name}
        </Link>
      </div>
      <div className={css("z-10")}>
        <ConnectButton />
      </div>
    </div>
  );
};

export default Header;
