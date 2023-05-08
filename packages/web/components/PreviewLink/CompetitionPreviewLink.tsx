import { css } from "../../helpers/css";
import { Competition } from "../../interfaces";
import ActivePill from "../ActivePill/ActivePill";
import AspectRatio from "../DSL/AspectRatio/AspectRatio";
import Logo from "../Logo/Logo";
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
          className={css(
            "bg-cover",
            "bg-center",
            "bg-no-repeat",
            "h-full",
            "relative"
          )}
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
            <div
              className={css(
                "absolute",
                "flex",
                "justify-end",
                "items-end",
                "p-2"
              )}
            >
              <ActivePill />
            </div>
          )}
          {!competition.coverMedia && (
            <div
              className={css(
                "absolute",
                "top-[50%]",
                "left-[50%]",
                "-translate-x-1/2",
                "-translate-y-1/2",
                "text-neutral-300",
                "dark:text-neutral-700",
                "group-hover:text-red-700"
              )}
            >
              <Logo size={32} />
            </div>
          )}
        </AspectRatio>
      </PreviewLink>
    </div>
  );
};

export default CompetitionPreviewLink;
