import { observer } from "mobx-react-lite";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { FaMousePointer, FaTwitter } from "react-icons/fa";
import AsyncGrid from "../../../components/DSL/AsyncGrid/AsyncGrid";
import Link, { LinkType } from "../../../components/DSL/Link/Link";
import Pane from "../../../components/DSL/Pane/Pane";
import Text, { TextSize, TextType } from "../../../components/DSL/Text/Text";
import CompetitionPreviewLink from "../../../components/PreviewLink/CompetitionPreviewLink";
import MemePreviewLink from "../../../components/PreviewLink/MemePreviewLink";
import { css } from "../../../helpers/css";
import { abbreviate, getRainobwURL } from "../../../helpers/strings";
import { Profile } from "../../../interfaces";
import AppLayout from "../../../layouts/App.layout";
import Http from "../../../services/http";
import redirectTo404 from "../../../services/redirect/404";
import ProfileStore, { ProfileView } from "../../../store/Profile.store";
interface ProfileProps {
  profile: Profile;
}

const ProfilePage: React.FC<ProfileProps> = observer(({ profile }) => {
  const {
    query: { memeOrCompetition },
  } = useRouter();

  const store = useMemo(
    () => new ProfileStore(profile, memeOrCompetition as ProfileView),
    [profile, memeOrCompetition]
  );
  useEffect(() => {
    store.init();
  }, [store]);
  return (
    <AppLayout>
      <div>
        <div className={css("flex", "justify-center", "sm:justify-start")}>
          <div
            className={css(
              "flex",
              "flex-col",
              "items-center",
              "justify-center",
              "w-full",
              "mt-8",
              "mb-4"
            )}
          >
            <div
              className={css(
                "h-[85px]",
                "w-[85px]",
                "sm:h-[100px]",
                "sm:w-[100px]",
                "bg-center",
                "bg-no-repeat",
                "bg-contain",
                "border-[1px]",
                "border-black",
                "dark:border-neutral-600",
                "dark:bg-neutral-800",
                "rounded-full",
                { "bg-slate-200": !profile.avatar }
              )}
              style={
                profile.avatar
                  ? {
                      backgroundImage: `url(${store.profile.avatar})`,
                    }
                  : {}
              }
            />
            <div
              className={css(
                "mt-2",
                "ml-2",
                "flex",
                "flex-col",
                "items-center",
                "text-sm"
              )}
            >
              <Link
                type={LinkType.Secondary}
                isExternal
                href={getRainobwURL(store.profile.address)}
              >
                {store.profile.user.ens
                  ? store.profile.user.ens
                  : abbreviate(store.profile.address)}
              </Link>
            </div>
            <div className={css("flex", "gap-0.5", "items-baseline")}>
              <Text size={TextSize.sm} type={TextType.Grey}>
                wan:
              </Text>
              <Text size={TextSize.sm} bold>
                {store.profile.wan}
              </Text>
            </div>
            <div
              className={css(
                "flex",
                "flex-col",
                "gap-1",
                "items-center",
                "mt-8"
              )}
            >
              <div className={css("flex", "gap-1", "items-center")}>
                {store.externalUrl && (
                  <Link
                    type={LinkType.Secondary}
                    isExternal
                    href={store.externalUrl}
                    hideExternalIcon
                  >
                    <FaMousePointer size={14} />
                  </Link>
                )}
                {store.twitterUsername && (
                  <Link
                    type={LinkType.Secondary}
                    isExternal
                    href={`https://twitter.com/${store.twitterUsername}`}
                    hideExternalIcon
                  >
                    <FaTwitter size={14} />
                  </Link>
                )}
              </div>
              {store.description && (
                <Text type={TextType.Grey}>{store.description}</Text>
              )}
            </div>
          </div>
        </div>
        <Pane
          title={
            <div className={css("inline-flex", "gap-4", "cursor-pointer")}>
              <div
                className={css({ underline: store.isMemeView })}
                onClick={() => store.goToMemeView()}
              >
                Memes
              </div>
              <div
                className={css({ underline: store.isCompetitionView })}
                onClick={() => store.goToCompetitionView()}
              >
                Competitions
              </div>
            </div>
          }
        >
          <AsyncGrid isLoading={store.isLoading} data={store.data}>
            {store.view === ProfileView.Meme &&
              store.memes.map((meme) => (
                <MemePreviewLink key={`meme-preview-${meme.id}`} meme={meme} />
              ))}
            {store.view === ProfileView.Competition &&
              store.competitions.map((comp) => (
                <CompetitionPreviewLink
                  key={`comp-preview-${comp.id}`}
                  competition={comp}
                />
              ))}
          </AsyncGrid>
        </Pane>
      </div>
    </AppLayout>
  );
});

export const getServerSideProps: GetServerSideProps<ProfileProps> = async (
  context
) => {
  const { addressOrEns } = context.query;
  try {
    const { data: profile } = await Http.getProfile(addressOrEns as string);
    return {
      props: { profile },
    };
  } catch (e) {
    return redirectTo404();
  }
};

export default ProfilePage;
