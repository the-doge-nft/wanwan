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
import PreviewLink from "../../../components/PreviewLink/PreviewLink";
import { css } from "../../../helpers/css";
import { abbreviate, getEtherscanURL } from "../../../helpers/strings";
import { Profile } from "../../../interfaces";
import AppLayout from "../../../layouts/App.layout";
import http from "../../../services/http";
import ProfileStore from "../../../store/Profile.store";

interface ProfileProps {
  profile: Profile;
}

const ProfileView: React.FC<ProfileProps> = observer(({ profile }) => {
  const {
    query: { addressOrEns, memeOrCompetition },
  } = useRouter();
  console.log(addressOrEns, memeOrCompetition);
  const store = useMemo(() => new ProfileStore(profile), [profile]);
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
                { "bg-gray-300": !profile.avatar }
              )}
              style={
                profile.avatar
                  ? {
                      backgroundImage: `url(${profile.avatar})`,
                    }
                  : {}
              }
            />
            <div className={css("mt-1", "flex", "flex-col", "items-center")}>
              <div>{store.profile.ens}</div>
              {store.profile.address && (
                <Link
                  isExternal
                  href={getEtherscanURL(profile.address, "address")}
                  className={css("inline-flex")}
                >
                  {abbreviate(store.profile.address)}
                </Link>
              )}
            </div>
          </div>
        </div>
        <Pane
          title={
            <div className={css("inline-flex", "gap-2", "cursor-pointer")}>
              <Link href={`/profile/${addressOrEns}/meme`}>Meme</Link>
              <Link href={`/profile/${addressOrEns}/competition`}>
                Competition
              </Link>
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
              renderNoData={() => <NoDataFound>memes</NoDataFound>}
            >
              {store.memes.map((meme) => (
                <div
                  key={`meme-preview-${meme.id}`}
                  className={css("max-w-[200px]")}
                >
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
    console.log(profile);
    return {
      props: { profile },
    };
  } catch (e) {
    console.error(e);
    return { props: { profile: {} } };
  }
};

export default ProfileView;
