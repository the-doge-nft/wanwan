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
        {leaderboard.map((item, index) => (
          <div
            key={item.address}
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
                  "bg-neutral-200",
                  "rounded-full",
                  "border-[1px]",
                  "border-black",
                  "dark:border-white"
                )}
              />
              <Link href={`/profile/${item.address}/meme`}>
                <Text type={TextType.NoColor}>
                  {item.ens ? item.ens : abbreviate(item.address)}
                </Text>
              </Link>
            </div>

            <Text size={TextSize.sm} bold>
              {item.wan}
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
