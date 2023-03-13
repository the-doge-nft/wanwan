import { format } from "date-fns";
import { observer } from "mobx-react-lite";
import { css } from "../../helpers/css";
import { abbreviate } from "../../helpers/strings";
import CompetitionByIdStore from "../../store/CompetitionId.store";
import Link, { LinkType } from "../DSL/Link/Link";
import Text, { TextSize, TextType } from "../DSL/Text/Text";

const CompetitionDetails: React.FC<{ store: CompetitionByIdStore }> = observer(
  ({ store }) => {
    return (
      <>
        <div className={css("flex", "flex-col", "gap-4", "flex-wrap")}>
          {store.competition.description && (
            <div>
              <Text size={TextSize.sm}>{store.competition.description}</Text>
            </div>
          )}
          <div
            className={css("flex", "justify-between", "items-end", "flex-wrap")}
          >
            <div className={css("flex", "gap-1", "items-center")}>
              <Text size={TextSize.sm} bold>
                Votes:
              </Text>
              <Text size={TextSize.sm}>{store.totalVotes}</Text>
            </div>
            <div className={css("flex", "gap-1", "items-center")}>
              <Text size={TextSize.sm} bold>
                Submissions:
              </Text>
              <Text size={TextSize.sm}>{store.memes.length}</Text>
            </div>
            <div className={css("flex", "gap-1", "items-center")}>
              <Text size={TextSize.sm} bold>
                Max Entries:
              </Text>
              <Text size={TextSize.sm}>
                {store.competition.maxUserSubmissions}
              </Text>
            </div>
            <div className={css("flex", "gap-1", "items-center")}>
              <Text size={TextSize.sm} bold>
                Ends at:
              </Text>
              <Text size={TextSize.sm}>
                {format(new Date(store.competition.endsAt), "Pp")}
              </Text>
            </div>
            <div className={css("flex", "gap-1", "items-center")}>
              <Text size={TextSize.sm} bold>
                Created by:
              </Text>
              <Link
                type={LinkType.Secondary}
                href={`/profile/${store.competition.user.address}/competition`}
              >
                {store.competition.user.ens
                  ? store.competition.user.ens
                  : abbreviate(store.competition.user.address)}
              </Link>
            </div>
          </div>
          <div className={css("text-right")}>
            <div
              className={css(
                "rounded-full",
                "border-[1px]",
                "px-2",
                "py-1",
                "inline-flex",
                "items-center",
                "border-black",
                "dark:border-neutral-700",
                {
                  "bg-red-800 text-white": !store.competition.isActive,
                  "text-black dark:text-white": store.competition.isActive,
                }
              )}
            >
              <Text size={TextSize.xs} type={TextType.NoColor}>
                {store.competition.isActive ? "active" : "ended"}
              </Text>
            </div>
          </div>
        </div>
      </>
    );
  }
);

export default CompetitionDetails;
