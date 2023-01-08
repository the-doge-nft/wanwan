import env from "../../environment";
import { css } from "../../helpers/css";
import { ConnectButton } from "../dsl/Button/Button";
import Link from "../dsl/Link/Link";

const navItems = [
  { name: "home", link: "/" },
  { name: "dsl", link: "/components" },
];

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
        {env.app.name}
      </div>
      <div>
        <ConnectButton />
      </div>
    </div>
  );
};

export default Header;
