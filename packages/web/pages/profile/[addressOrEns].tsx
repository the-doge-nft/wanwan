import { GetServerSideProps } from "next";
import Code from "../../components/Code/Code";
import Dev from "../../components/Dev/Dev";
import { css } from "../../helpers/css";
import { ProfileI } from "../../interfaces";
import AppLayout from "../../layouts/App.layout";
import http from "../../services/http";

interface ProfileProps {
  profile: ProfileI;
}

const Profile: React.FC<ProfileProps> = ({ profile }) => {
  return (
    <AppLayout>
      <div>
        <div className={css("flex", "justify-center", "sm:justify-start")}>
          <div className={css("flex", "flex-col", "items-center")}>
            <div
              className={css(
                "h-[150px]",
                "w-[150px]",
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
            <div>{profile.ens}</div>
          </div>
        </div>
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
