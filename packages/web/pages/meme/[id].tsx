import { GetServerSideProps } from "next";
import Code from "../../components/dsl/Code/Code";
import { css } from "../../helpers/css";
import { jsonify } from "../../helpers/strings";
import { Meme } from "../../interfaces";
import AppLayout from "../../layouts/App.layout";
import http from "../../services/http";

interface MemeByIdProps {
  meme: Meme;
}

const MemeById: React.FC<Meme> = ({ ...meme }) => {
  return (
    <AppLayout>
      <Code>{jsonify(meme)}</Code>
      <div
        className={css(
          "w-[200px]",
          "h-[200px]",
          "bg-contain",
          "bg-no-repeat",
          "bg-center"
        )}
        style={{ backgroundImage: `url(${meme.media.url})` }}
      />
    </AppLayout>
  );
};

export const getServerSideProps: GetServerSideProps<MemeByIdProps> = async (
  context
) => {
  const { id } = context.query;
  try {
    const { data: meme } = await http.get(`/meme/${id}`);
    return {
      props: meme,
    };
  } catch (e) {
    console.error(e);
    return { props: null };
  }
};

export default MemeById;
