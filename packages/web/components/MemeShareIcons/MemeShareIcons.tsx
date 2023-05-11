import { observer } from "mobx-react-lite";
import { AiFillHeart } from "react-icons/ai";
import { BsReddit, BsTwitter } from "react-icons/bs";
import { RedditShareButton, TwitterShareButton } from "react-share";
import { TITLE, getBaseUrl } from "../../environment/vars";
import { css } from "../../helpers/css";
import { getBingReverseImageSearchURL } from "../../helpers/strings";
import { Meme } from "../../interfaces";
import AppStore from "../../store/App.store";
import Link, { LinkType } from "../DSL/Link/Link";
import Text, { TextSize, TextType } from "../DSL/Text/Text";

interface MemeShareIconsProps {
  onClickLike: () => void;
  isLiked: boolean;
  meme: Meme;
  likes: number;
  size?: "sm" | "lg";
}

const MemeShareIcons = observer(
  ({ meme, onClickLike, isLiked, likes, size = "lg" }: MemeShareIconsProps) => {
    const title = meme.name ? `${meme.name} on wanwan.me` : TITLE;
    const url = getBaseUrl() + "/meme/" + meme.id;
    return (
      <div className={css("flex", "items-center", "gap-1.5", "mt-0.5")}>
        <span
          className={css("inline-flex", "items-center", "gap-0.5", "-mr-1")}
        >
          <Text
            size={size === "lg" ? TextSize.xs : TextSize.xxs}
            type={likes && likes > 0 ? TextType.Primary : TextType.Grey}
          >
            {likes}
          </Text>
          <button
            onClick={() => AppStore.auth.runOrAuthPrompt(() => onClickLike())}
          >
            <span
              className={css({
                "text-black dark:text-white": isLiked,
                "text-neutral-500 hover:text-black dark:hover:text-white":
                  !isLiked,
              })}
            >
              <AiFillHeart size={size === "lg" ? 16 : 14} />
            </span>
          </button>
        </span>
        <Link
          isExternal
          type={LinkType.Tertiary}
          className={css("w-full")}
          href={getBingReverseImageSearchURL(meme.media.url)}
        />
        <TwitterShareButton url={url} title={title}>
          <span
            className={css(
              "hover:text-black",
              "dark:hover:text-white",
              "text-neutral-500"
            )}
          >
            <BsTwitter size={size === "lg" ? 16 : 14} />
          </span>
        </TwitterShareButton>
        <RedditShareButton url={url} title={title}>
          <span
            className={css(
              "hover:text-black",
              "dark:hover:text-white",
              "text-neutral-500"
            )}
          >
            <BsReddit size={size === "lg" ? 16 : 14} />
          </span>
        </RedditShareButton>
      </div>
    );
  }
);

export default MemeShareIcons;
