import { observer } from "mobx-react-lite";
import { AiOutlineEllipsis } from "react-icons/ai";
import {
  BsDiscord,
  BsFillMoonFill,
  BsFillSunFill,
  BsTwitter,
} from "react-icons/bs";
import { vars } from "../../environment/vars";
import { css } from "../../helpers/css";
import AppStore from "../../store/App.store";
import Button from "../DSL/Button/Button";
import { Divider } from "../DSL/Divider/Divider";
import Dropdown, { DropdownItem } from "../DSL/Dropdown/Dropdown";
import Link, { LinkType } from "../DSL/Link/Link";
import Text, { TextSize, TextType } from "../DSL/Text/Text";

const EllipsesButton = observer(() => {
  return (
    <Dropdown
      trigger={
        <Button stretch>
          <AiOutlineEllipsis />
        </Button>
      }
    >
      <DropdownItem className={css("mt-0.5")}>
        <div className={css()}>
          <Button onClick={() => AppStore.settings.toggleColorMode()}>
            {AppStore.settings.isLightMode ? (
              <BsFillMoonFill size={12} />
            ) : (
              <BsFillSunFill size={12} />
            )}
          </Button>
        </div>
      </DropdownItem>
      <DropdownItem className={css("mt-2")}>
        <div className={css("flex", "flex-col")}>
          <Link href={"/memes"} type={LinkType.Secondary}>
            <Text size={TextSize.lg} type={TextType.NoColor}>
              Explore
            </Text>
          </Link>
          <Link href={"/faq"} type={LinkType.Secondary}>
            <Text size={TextSize.lg} type={TextType.NoColor}>
              FAQ
            </Text>
          </Link>
        </div>
        <div className={css("my-1.5")}>
          <Divider />
        </div>
        <div
          className={css(
            "pt-1.5",
            "pb-1",
            "flex",
            "items-center",
            "justify-between"
          )}
        >
          <div className={css("flex", "items-center", "gap-1.5")}>
            <Link
              hideExternalIcon
              type={LinkType.Secondary}
              href={"https://twitter.com/wanwandotme"}
              isExternal
            >
              <BsTwitter size={15} />
            </Link>
            <Link
              hideExternalIcon
              type={LinkType.Secondary}
              href={"https://discord.com/invite/thedogenft"}
              isExternal
            >
              <BsDiscord size={15} />
            </Link>
          </div>
          <div>
            <Link
              isExternal
              type={LinkType.Tertiary}
              href={`https://github.com/the-doge-nft/wanwan/commit/${vars.BuildHash}`}
            >
              <Text size={TextSize.xs} type={TextType.NoColor}>
                {vars.BuildHash.slice(0, 8)}
              </Text>
            </Link>
          </div>
        </div>
      </DropdownItem>
    </Dropdown>
  );
});

export default EllipsesButton;
