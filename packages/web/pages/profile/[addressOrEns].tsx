import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useMemo } from "react";
import CreateMeme from "../../components/CreateMeme/CreateMeme";
import Code from "../../components/dsl/Code/Code";
import Dev from "../../components/dsl/Dev/Dev";
import Link from "../../components/dsl/Link/Link";
import { css } from "../../helpers/css";
import { abbreviate, getEtherscanURL } from "../../helpers/strings";
import { ProfileI } from "../../interfaces";
import AppLayout from "../../layouts/App.layout";
import http from "../../services/http";
import ProfileStore from "../../store/Profile.store";

interface ProfileProps {
  profile: ProfileI;
}

const Profile: React.FC<ProfileProps> = ({ profile }) => {
  const {
    query: { addressOrEns },
  } = useRouter();
  const store = useMemo(() => new ProfileStore(), [addressOrEns]);
  return (
    <AppLayout>
      <div>
        <div className={css("flex", "justify-center", "sm:justify-start")}>
          <div className={css("flex", "flex-col", "items-center")}>
            <div
              className={css(
                "h-[100px]",
                "w-[100px]",
                "sm:h-[150px]",
                "sm:w-[150px]",
                "bg-center",
                "bg-no-repeat",
                "bg-contain",
                "border-[1px]",
                "border-gray-600",
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
              <div>{profile.ens}</div>
              {profile.address && (
                <Link
                  isExternal
                  href={getEtherscanURL(profile.address, "address")}
                  className={css("inline-flex")}
                >
                  {abbreviate(profile.address)}
                </Link>
              )}
            </div>
          </div>
        </div>
        <CreateMeme />
        <Dev>
          <Code className={css("mt-11")}>{JSON.stringify(profile)}</Code>
        </Dev>
      </div>
    </AppLayout>
  );
};

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
    console.error(e);
    return { props: { profile: {} } };
  }
};

export default Profile;
