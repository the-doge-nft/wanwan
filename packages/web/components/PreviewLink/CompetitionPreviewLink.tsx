import { css } from "../../helpers/css";
import { Competition } from "../../interfaces";
import ActivePill from "../ActivePill/ActivePill";
import AspectRatio from "../DSL/AspectRatio/AspectRatio";
import PreviewLink from "./PreviewLink";

const CompetitionPreviewLink = ({
  competition,
}: {
  competition: Competition;
}) => {
  return (
    <div className={css("relative")}>
      <PreviewLink
        name={competition.name}
        href={`/competition/${competition.id}`}
      >
        <AspectRatio
          className={css("bg-cover", "bg-center", "bg-no-repeat", "h-full")}
          ratio={
            competition?.coverMedia
              ? `${competition.coverMedia.width}/${competition.coverMedia.height}`
              : "1/1"
          }
          style={
            competition.coverMedia
              ? { backgroundImage: `url(${competition.coverMedia.url})` }
              : {}
          }
        >
          {competition.isActive && (
            <div className={css("flex", "items-end", "justify-end", "p-1")}>
              <ActivePill />
            </div>
          )}
        </AspectRatio>
      </PreviewLink>
    </div>
  );
};

export default CompetitionPreviewLink;
