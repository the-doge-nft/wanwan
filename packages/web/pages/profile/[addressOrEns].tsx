import { GetServerSideProps } from "next";
import AppLayout from "../../layouts/App.layout";
import http from "../../services/http";

interface ProfileProps {
  profile: any;
}

const Profile: React.FC<ProfileProps> = ({ profile }) => {
  return (
    <AppLayout>
      <div>profile</div>
      <div>{JSON.stringify(profile)}</div>
    </AppLayout>
  );
};

export const getServerSideProps: GetServerSideProps<ProfileProps> = async (
  context
) => {
  const { addressOrEns } = context.query;
  const { data: profile } = await http.get(`/profile/${addressOrEns}`);
  console.log(profile);
  try {
  } catch (e) {
    console.error(e);
  }
  return {
    props: { profile },
  };
};

export default Profile;
