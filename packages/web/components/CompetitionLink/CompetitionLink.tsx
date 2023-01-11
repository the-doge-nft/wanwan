import Link from "next/link";
import { css } from "../../helpers/css";
import { Competition } from "../../interfaces";

const CompetitionLink: React.FC<Competition> = ({ ...competition }) => {
  return (
    <Link href={`/competition/${competition.id}`}>
      <div className={css("break-words", "max-w-full")}>
        <div
          className={css(
            "whitespace-nowrap",
            "overflow-hidden",
            "overflow-ellipsis"
          )}
        >
          {competition.name}
        </div>
        <div className={css("text-xs", "break-words")}>
          {JSON.stringify(competition)}
        </div>
      </div>
    </Link>
  );
};
export default CompetitionLink;
