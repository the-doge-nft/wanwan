import { css } from "../../helpers/css";
import { Meme } from "../../interfaces";
import AspectRatio from "../dsl/AspectRatio/AspectRatio";
import Link from "../dsl/Link/Link";

interface MemePreviewProps extends Meme {}

const MemeLink: React.FC<MemePreviewProps> = ({ ...meme }) => {
  return (
    <div className={css()}>
      <Link
        key={`meme-${meme.id}`}
        href={`/meme/${meme.id}`}
        className={css("w-full")}
      >
        <div
          className={css(
            "max-w-full",
            "h-full",
            "hover:border-red-700",
            "border-[1px]",
            "h-[115px]",
            "overflow-y-hidden"
          )}
        >
          <AspectRatio
            className={css(
              "max-w-[300px]",
              "bg-cover",
              "bg-center",
              "bg-no-repeat",
              "h-full"
            )}
            ratio={`${meme.media.width}/${meme.media.height}`}
            style={{
              backgroundImage: `url(${meme.media.url})`,
            }}
          />
        </div>
      </Link>
      <div className={css("text-xs")}>
        <div className={css("font-bold")}>{meme.name}</div>
        <div className={css("text-slate-700")}>{meme.description}</div>
      </div>
    </div>
  );
};

export default MemeLink;
