import { observer } from "mobx-react-lite";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import AspectRatio from "../../components/DSL/AspectRatio/AspectRatio";
import { Submit } from "../../components/dsl/Button/Button";
import Code from "../../components/dsl/Code/Code";
import { DevToggle } from "../../components/dsl/Dev/Dev";
import Form from "../../components/DSL/Form/Form";
import TextInput from "../../components/DSL/Form/TextInput";
import Link from "../../components/dsl/Link/Link";
import { css } from "../../helpers/css";
import { abbreviate, jsonify } from "../../helpers/strings";
import { Meme } from "../../interfaces";
import AppLayout from "../../layouts/App.layout";
import http from "../../services/http";
import MemeIdStore from "../../store/MemeId.store";

interface MemeByIdProps {
  meme: Meme;
}

const MemeById: React.FC<Meme> = observer(({ ...meme }) => {
  const {
    query: { id },
  } = useRouter();
  const store = useMemo(() => new MemeIdStore(id as string), [id]);
  useEffect(() => {
    store.init();
  }, [store]);
  return (
    <AppLayout>
      <div className={css("mt-4")}>
        <AspectRatio
          className={css("bg-contain", "bg-center", "bg-no-repeat")}
          ratio={`${meme.media.width}/${meme.media.height}`}
          style={{
            backgroundImage: `url(${meme.media.url})`,
          }}
        />
        <div className={css("flex", "justify-between", "items-end", "text-sm")}>
          <div>
            {meme.name && <div className={css("font-bold")}>{meme.name}</div>}
            {meme.description && (
              <div className={css()}>{meme.description}</div>
            )}
          </div>
          <Link href={`/profile/${meme.user.address}`}>
            {abbreviate(meme.user.address)}
          </Link>
        </div>
        <div className={css("mt-8")}>
          {store.comments.map((comment) => (
            <div key={`comment-${comment.id}`} className={css("text-xs")}>
              <div>{comment.body}</div>
              <div className={css("text-right", "text-slate-500")}>
                {new Date(comment.createdAt).toDateString()}
              </div>
            </div>
          ))}
          <Form
            onSubmit={(values) =>
              store.onCommentSubmit({ parentCommentId: 0, body: values.body })
            }
          >
            <TextInput type={"textarea"} name={"body"} label={"comment"} />
            <Submit />
          </Form>
        </div>
        <DevToggle>
          <Code>{jsonify(meme)}</Code>
        </DevToggle>
      </div>
    </AppLayout>
  );
});

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
