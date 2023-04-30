import { observer } from "mobx-react-lite";
import { GetServerSideProps } from "next";
import Link from "../components/DSL/Link/Link";
import Pane, { PaneType } from "../components/DSL/Pane/Pane";
import Text, { TextSize, TextType } from "../components/DSL/Text/Text";
import { css } from "../helpers/css";
import { abbreviate } from "../helpers/strings";
import { Leaderboard } from "../interfaces";
import AppLayout from "../layouts/App.layout";
import Http from "../services/http";
import redirectTo404 from "../services/redirect/404";

interface LeaderboardPageProps {
  leaderboard: Leaderboard[];
}

const LeaderboardPage = observer(({ leaderboard }: LeaderboardPageProps) => {
  return (
    <AppLayout>
      <Pane
        title={"Leaderboard"}
        type={PaneType.Grey}
        padding={false}
        rightOfTitle={<Text>Wan</Text>}
      >
        {leaderboard.map((user, index) => (
          <div
            key={user.address}
            className={css(
              "flex",
              "justify-between",
              "px-2",
              "py-1.5",
              "items-center",
              {
                "bg-neutral-100 dark:bg-[#0f0f0f]": index % 2 === 0,
              }
            )}
          >
            <div className={css("flex", "items-center", "gap-3")}>
              <Text type={TextType.Grey}>{index + 1}</Text>
              <div
                className={css(
                  "w-[30px]",
                  "h-[30px]",
                  "rounded-full",
                  "border-[1px]",
                  "border-black",
                  "dark:border-neutral-700",
                  { "bg-netural-200 dark:bg-neutral-800": !user.avatar }
                )}
              />
              <Link href={`/profile/${user.address}/meme`}>
                <Text type={TextType.NoColor}>
                  {user.ens ? user.ens : abbreviate(user.address)}
                </Text>
              </Link>
            </div>

            <Text size={TextSize.sm} bold>
              {user.wan}
            </Text>
          </div>
        ))}
      </Pane>
    </AppLayout>
  );
});

export const getServerSideProps: GetServerSideProps<
  LeaderboardPageProps
> = async () => {
  try {
    const { data: leaderboard } = await Http.getLeaderboard();
    return {
      props: { leaderboard },
    };
  } catch (e) {
    return redirectTo404();
  }
};

export default LeaderboardPage;
