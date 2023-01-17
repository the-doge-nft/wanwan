import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  format,
} from "date-fns";
import { observer } from "mobx-react-lite";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { BsDot } from "react-icons/bs";
import AspectRatio from "../../components/DSL/AspectRatio/AspectRatio";
import { Submit } from "../../components/DSL/Button/Button";
import Form from "../../components/DSL/Form/Form";
import TextInput from "../../components/DSL/Form/TextInput";
import Link, { LinkType } from "../../components/DSL/Link/Link";
import { css } from "../../helpers/css";
import { abbreviate } from "../../helpers/strings";
import { Comment, Meme } from "../../interfaces";
import AppLayout from "../../layouts/App.layout";
import http from "../../services/http";
import AppStore from "../../store/App.store";
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
        <div className={css("px-24")}>
          <AspectRatio
            className={css(
              "bg-contain",
              "bg-center",
              "bg-no-repeat",
              "border-[1px]",
              "border-black"
            )}
            ratio={`${meme.media.width}/${meme.media.height}`}
            style={{
              backgroundImage: `url(${meme.media.url})`,
            }}
          />
        </div>
        <div
          className={css(
            "grid",
            "grid-cols-1",
            "md:grid-cols-12",
            "md:grid-rows-1",
            "text-sm",
            "mt-8",
            "w-full"
          )}
        >
          <div className={css("md:col-span-10")}>
            {meme.name && (
              <div className={css("font-bold", "break-words")}>{meme.name}</div>
            )}
            {meme.description && (
              <div className={css("break-words")}>{meme.description}</div>
            )}
          </div>
          <div
            className={css("md:col-span-2", "flex", "justify-end", "items-end")}
          >
            <Link href={`/profile/${meme.user.address}/meme`}>
              {abbreviate(meme.user.address)}
            </Link>
          </div>
        </div>
        <div className={css("text-xs", "text-slate-600", "w-full")}>
          {format(new Date(meme.createdAt), "Pp")}
        </div>
        <div className={css("mt-8")}>
          <CommentForm
            store={store}
            onSubmit={({ body }: { body: string }) =>
              store.onCommentSubmit(body)
            }
          />
          <div className={css("flex", "flex-col", "gap-3", "mt-4")}>
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
      </div>
    </AppLayout>
  );
});

const CommentForm: React.FC<{
  onSubmit: (body: any) => Promise<void>;
}> = observer(({ onSubmit }) => {
  return (
    <Form
      className={css("w-full")}
      onSubmit={(values, form) => onSubmit(values).then(() => form.reset())}
    >
      <TextInput
        block
        type={"textarea"}
        name={"body"}
        // validate={required}
        label={
          AppStore.auth.address ? (
            <div className={css("text-sm")}>
              Comment as{" "}
              <Link
                type={LinkType.Secondary}
                href={`/profile/${AppStore.auth.address}/meme`}
              >
                {abbreviate(AppStore.auth.address)}
              </Link>
            </div>
          ) : (
            "Comment"
          )
        }
      />
      <div className={css("flex", "justify-end", "mt-2")}>
        <Submit>Comment</Submit>
      </div>
    </Form>
  );
});

const MemeComment: React.FC<
  Comment & { onCommentSubmit: (body: string) => Promise<void> }
> = ({ onCommentSubmit, ...comment }) => {
  const [showReply, setShowReply] = useState(false);
  const today = new Date();
  const commentCreatedAt = new Date(comment.createdAt);
  const diffInSecs = differenceInSeconds(today, commentCreatedAt);
  const diffInMins = differenceInMinutes(today, commentCreatedAt);
  const diffInHours = differenceInHours(today, commentCreatedAt);
  const diffInDays = differenceInDays(today, commentCreatedAt);
  let diffFormatted = `${diffInSecs} seconds`;
  if (diffInSecs >= 60) {
    diffFormatted = `${diffInMins} minutes`;
    if (diffInMins >= 60) {
      diffFormatted = `${diffInHours} hours`;
      if (diffInHours >= 24) {
        diffFormatted = `${diffInDays} days`;
      }
    }
  }
  return (
    <div
      key={`comment-${comment.id}`}
      className={css(
        "text-xs",
        "bg-slate-200",
        "p-2",
        "border-[1px]",
        "border-slate-300"
      )}
    >
      <div className={css("flex", "items-center")}>
        <Link
          type={LinkType.Secondary}
          href={`/profile/${comment.user.address}/meme`}
        >
          {abbreviate(comment.user.address)}
        </Link>
        <BsDot />
        <div>{diffFormatted} ago</div>
      </div>
      <div className={css("text-sm")}>{comment.body}</div>
      <div className={css("flex", "justify-end")}>
        <button
          className={css(
            "hover:underline",
            "text-slate-500",
            "hover:text-slate-900"
          )}
          onClick={() => setShowReply(!showReply)}
        >
          {showReply ? "hide" : "reply"}
        </button>
      </div>
      {showReply && (
        <CommentForm
          onSubmit={({ body }) =>
            onCommentSubmit(body).then(() => setShowReply(false))
          }
        />
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
