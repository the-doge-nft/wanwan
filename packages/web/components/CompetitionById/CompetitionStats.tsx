import { format } from "date-fns";
import { observer } from "mobx-react-lite";
import { css } from "../../helpers/css";
import { abbreviate } from "../../helpers/strings";
import CompetitionByIdStore from "../../store/CompetitionId.store";
import ActivePill from "../ActivePill/ActivePill";
import Link, { LinkType } from "../DSL/Link/Link";
import Text, { TextSize } from "../DSL/Text/Text";

const CompetitionStats: React.FC<{ store: CompetitionByIdStore }> = observer(
  ({ store }) => {
    return (
      <>
        <div
          className={css("grid", "md:grid-cols-2", "lg:grid-cols-3", "gap-1")}
        >
          <Detail label={"Votes:"}>{store.totalVotes}</Detail>
          <Detail label={"Submissions:"}>{store.memes.length}</Detail>
          <Detail label={"Entries:"}>
            {store.competition.maxUserSubmissions}
          </Detail>
          <Detail label={"Created:"}>
            {format(new Date(store.competition.createdAt), "Pp")}
          </Detail>
          <Detail label={"Ends:"}>
            {format(new Date(store.competition.endsAt), "Pp")}
          </Detail>

          <Detail label={"By:"}>
            <Link
              type={LinkType.Secondary}
              href={`/profile/${store.competition.user.address}/competition`}
            >
              {store.competition.user.ens
                ? store.competition.user.ens
                : abbreviate(store.competition.user.address)}
            </Link>
          </Detail>
        </div>
        {store.isActive && (
          <div className={css("text-right")}>
            <ActivePill />
          </div>
        )}
      </>
    );
  }
);

interface DetailProps {
  label: string;
  children: React.ReactNode;
}

const Detail = ({ label, children }: DetailProps) => {
  return (
    <div className={css("flex", "gap-1", "items-center")}>
      <Text size={TextSize.sm} bold>
        {label}
      </Text>
      <Text ellipses size={TextSize.sm}>
        {children}
      </Text>
    </div>
  );
};

export default CompetitionStats;
