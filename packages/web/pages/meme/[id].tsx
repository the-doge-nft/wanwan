import { observer } from "mobx-react-lite";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { BsDot } from "react-icons/bs";
import AspectRatio from "../../components/DSL/AspectRatio/AspectRatio";
import Button, { Submit } from "../../components/dsl/Button/Button";
import Code from "../../components/dsl/Code/Code";
import { DevToggle } from "../../components/dsl/Dev/Dev";
import Form from "../../components/DSL/Form/Form";
import TextInput from "../../components/DSL/Form/TextInput";
import Link from "../../components/dsl/Link/Link";
import { css } from "../../helpers/css";
import { abbreviate, jsonify } from "../../helpers/strings";
import { Comment, Meme } from "../../interfaces";
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
        <div
          className={css(
            "flex",
            "justify-between",
            "items-end",
            "text-sm",
            "mt-2"
          )}
        >
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
          <Form
            className={css("w-full")}
            onSubmit={({ body }) => store.onCommentSubmit(body)}
          >
            <TextInput
              block
              type={"textarea"}
              name={"body"}
              label={"comment as ___"}
            />
            <Submit>Comment</Submit>
          </Form>
          <div className={css("flex", "flex-col", "gap-3")}>
            {store.comments.map((comment) => (
              <MemeComment
                key={`meme-comment-${comment.id}`}
                {...comment}
                onCommentSubmit={(body) =>
                  store.onParentCommentSubmit(body, comment.id)
                }
              />
            ))}
          </div>
        </div>
        <DevToggle>
          <Code>{jsonify(meme)}</Code>
        </DevToggle>
      </div>
    </AppLayout>
  );
});

const MemeComment: React.FC<
  Comment & { onCommentSubmit: (body: string) => Promise<void> }
> = ({ onCommentSubmit, ...comment }) => {
  const [showReply, setShowReply] = useState(false);
  return (
    <div key={`comment-${comment.id}`} className={css("text-xs")}>
      <div className={css("flex", "items-center")}>
        <div></div>
        <div>{abbreviate(comment.user.address)}</div>
        <div className={css("flex", "items-center", "text-slate-600")}>
          <BsDot />
          <div>
            {Math.abs(
              new Date(comment.createdAt).getTime() - new Date().getTime()
            ) / 36e5}
          </div>
        </div>
      </div>
      <div className={css("text-sm")}>{comment.body}</div>
      <div>
        <Button onClick={() => setShowReply(!showReply)}>reply</Button>
      </div>
      {showReply && (
        <Form
          onSubmit={({ body }) =>
            onCommentSubmit(body).then(() => setShowReply(false))
          }
        >
          <TextInput type={"textarea"} name={"body"} label={"reply as ___"} />
          <Submit>Reply</Submit>
        </Form>
      )}
    </div>
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
