import { observer } from "mobx-react-lite";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import AspectRatio from "../../../components/DSL/AspectRatio/AspectRatio";
import AsyncWrap, {
  NoDataFound,
} from "../../../components/DSL/AsyncWrap/AsyncWrap";
import Link from "../../../components/DSL/Link/Link";
import Pane from "../../../components/DSL/Pane/Pane";
import { colors } from "../../../components/DSL/Theme";
import PreviewLink from "../../../components/PreviewLink/PreviewLink";
import { css } from "../../../helpers/css";
import { abbreviate, getEtherscanURL } from "../../../helpers/strings";
import { Profile } from "../../../interfaces";
import AppLayout from "../../../layouts/App.layout";
import http from "../../../services/http";
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
                "h-[100px]",
                "w-[100px]",
                "sm:h-[120px]",
                "sm:w-[120px]",
                "bg-center",
                "bg-no-repeat",
                "bg-contain",
                "border-[1px]",
                "border-black",
                "rounded-full",
                { "bg-slate-200": !profile.avatar }
              )}
              style={
                profile.avatar
                  ? {
                      backgroundImage: `url(${profile.avatar})`,
                    }
                  : {}
              }
            />
            <div
              className={css(
                "mt-1",
                "flex",
                "flex-col",
                "items-center",
                "text-sm"
              )}
            >
              <div>{store.profile.ens}</div>
              {store.profile.address && (
                <Link
                  isExternal
                  href={getEtherscanURL(profile.address, "address")}
                  className={css("inline-flex", "mt-2")}
                >
                  {abbreviate(store.profile.address)}
                </Link>
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
          <div
            className={css("grid", "grid-rows-[min-content]", "gap-4", "p-2")}
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            }}
          >
            <AsyncWrap
              isLoading={store.isLoading}
              hasData={store.hasData}
              renderNoData={() => (
                <NoDataFound>
                  {store.isMemeView ? "Memes" : "Competitions"}
                </NoDataFound>
              )}
            >
              {store.view === ProfileView.Meme &&
                store.memes.map((meme) => (
                  <div key={`meme-preview-${meme.id}`}>
                    <PreviewLink
                      name={meme.name}
                      description={meme.description}
                      link={`/meme/${meme.id}`}
                    >
                      <AspectRatio
                        className={css(
                          "bg-cover",
                          "bg-center",
                          "bg-no-repeat",
                          "h-full"
                        )}
                        ratio={`${meme.media.width}/${meme.media.height}`}
                        style={{ backgroundImage: `url(${meme.media.url})` }}
                      />
                    </PreviewLink>
                  </div>
                ))}
              {store.view === ProfileView.Competition &&
                store.competitions.map((comp) => (
                  <div key={`comp-preview-${comp.id}`}>
                    <PreviewLink
                      name={comp.name}
                      description={comp.description}
                      link={`/competition/${comp.id}`}
                    >
                      <AspectRatio
                        className={css(
                          "bg-cover",
                          "bg-center",
                          "bg-no-repeat",
                          "h-full"
                        )}
                        ratio={
                          comp?.media
                            ? `${comp.media.width}/${comp.media.height}`
                            : "1/1"
                        }
                        style={
                          comp.media
                            ? { backgroundImage: `url(${comp.media.url})` }
                            : { background: colors.slate[200] }
                        }
                      />
                    </PreviewLink>
                  </div>
                ))}
            </AsyncWrap>
          </div>
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
    const { data: profile } = await http.get(`/profile/${addressOrEns}`);
    return {
      props: { profile },
    };
  } catch (e) {
    throw new Error();
  }
};

export default ProfilePage;
