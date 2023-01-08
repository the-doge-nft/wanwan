import { css } from "../../helpers/css";
import { Meme } from "../../interfaces";
import AspectRatio from "../dsl/AspectRatio/AspectRatio";

interface MemePreviewProps extends Meme {}

const MemePreview: React.FC<MemePreviewProps> = ({ ...meme }) => {
  return (
    <div
      className={css(
        "max-w-full",
        "h-full",
        "hover:border-red-700",
        "border-[1px]"
      )}
    >
      <AspectRatio
        className={css(
          "max-w-[300px]",
          "bg-contain",
          "bg-center",
          "bg-no-repeat",
          "m-auto",
          "h-full"
        )}
        ratio={`${meme.media.width}/${meme.media.height}`}
        style={{
          backgroundImage: `url(${meme.media.url})`,
        }}
      />
      {/* <div className={css("text-xs")}>
          <div>{meme.name}</div>
          <div>{meme.description}</div>
        </div> */}
    </div>
  );
};

export default MemePreview;
