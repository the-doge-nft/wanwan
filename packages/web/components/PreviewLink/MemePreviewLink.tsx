import Image from "next/image";
import { css } from "../../helpers/css";
import { Meme } from "../../interfaces";
import PreviewLink from "./PreviewLink";

interface MemePreviewLinkProps {
  meme: Meme;
}

const MemePreviewLink = ({ meme }: MemePreviewLinkProps) => {
  return (
    <PreviewLink href={`/meme/${meme.id}`}>
      <Image
        fill
        alt={meme.media.url}
        src={meme.media.url}
        className={css("object-top", "object-cover")}
      />
    </PreviewLink>
  );
};

export default MemePreviewLink;
