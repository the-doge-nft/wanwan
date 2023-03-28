import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  format,
} from "date-fns";
import { observer } from "mobx-react-lite";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { BsDot } from "react-icons/bs";
import AspectRatio from "../../components/DSL/AspectRatio/AspectRatio";
import Button, { ButtonSize, Submit } from "../../components/DSL/Button/Button";
import Form from "../../components/DSL/Form/Form";
import TextInput from "../../components/DSL/Form/TextInput";
import Link, { LinkType } from "../../components/DSL/Link/Link";
import Text, { TextSize, TextType } from "../../components/DSL/Text/Text";
import env from "../../environment";
import {
  DESCRIPTION,
  getBaseUrl,
  TITLE,
  TWITTER_USERNAME,
} from "../../environment/vars";
import { css } from "../../helpers/css";
import { abbreviate } from "../../helpers/strings";
import { Comment, Meme } from "../../interfaces";
import AppLayout from "../../layouts/App.layout";
import Http from "../../services/http";
import redirectTo404 from "../../services/redirect/404";
import AppStore from "../../store/App.store";
import MemeIdStore from "../../store/MemeId.store";

interface MemeByIdProps {
  meme: Meme;
}

const MemeById = observer(({ meme }: MemeByIdProps) => {
  const {
    query: { id },
  } = useRouter();
  const store = useMemo(() => new MemeIdStore(id as string), [id]);
  useEffect(() => {
    store.init();
  }, [store]);

  const description = meme.description ? meme.description : DESCRIPTION;
  const socialCardUrl = meme.media.url;
  let url = getBaseUrl() + `/meme/` + meme.id;

  return (
    <>
      <Head>
        <title>{env.app.name}</title>
        <meta
          name="description"
          content={meme.description ? meme.description : ""}
          key="desc"
        />
        <meta property="og:site_name" content={TITLE} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={socialCardUrl} />
        <meta property="og:url" content={url} />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={socialCardUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={TWITTER_USERNAME} />
      </Head>
      <AppLayout>
        <div className={css("mt-4")}>
          <div className={css("", "sm:px-24")}>
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
            <div className={css("md:col-span-10", "flex", "flex-col")}>
              {meme.name && <Text bold>{meme.name}</Text>}
              {meme.description && (
                <Text size={TextSize.sm}>{meme.description}</Text>
              )}
            </div>
            <div
              className={css(
                "md:col-span-2",
                "flex",
                "justify-end",
                "items-end",
                "flex-col"
              )}
            >
              <Link href={`/profile/${meme.user.address}/meme`}>
                <Text type={TextType.NoColor} size={TextSize.sm}>
                  {meme.user.ens
                    ? meme.user.ens
                    : abbreviate(meme.user.address)}
                </Text>
              </Link>
              <Button
                size={ButtonSize.xs}
                onClick={() => {
                  const message = "Check out this sick meme!";
                  const screenshotUrl = `${getBaseUrl()}/meme/${meme.id}`;
                  const text = encodeURIComponent(
                    `${message}\n${screenshotUrl}`
                  );
                  window.open(
                    `https://twitter.com/intent/tweet?text=${text}`,
                    "_blank"
                  );
                }}
              >
                tweet it
              </Button>
            </div>
          </div>
          <Text size={TextSize.xs} type={TextType.Grey}>
            {format(new Date(meme.createdAt), "Pp")}
          </Text>
          <div className={css("mt-8")}>
            <CommentForm
              onSubmit={({ body }: { body: string }) =>
                store.onCommentSubmit(body)
              }
            />
            <div className={css("flex", "flex-col", "gap-3", "mt-8")}>
              {store.comments
                .filter((comment) => !comment.parentCommentId)
                .map((comment) => (
                  <MemeComment
                    isRootNode={true}
                    store={store}
                    key={`meme-comment-${comment.id}`}
                    comment={comment}
                    onCommentSubmit={(body) =>
                      store.onParentCommentSubmit(body, comment.id)
                    }
                  />
                ))}
            </div>
          </div>
        </div>
      </AppLayout>
    </>
  );
});

const CommentForm: React.FC<{
  onSubmit: (body: any) => Promise<void>;
  isReply?: boolean;
  onCancel?: () => void;
}> = observer(({ onSubmit, onCancel, isReply = false }) => {
  const replyOrComment = isReply ? "Reply" : "Comment";
  return (
    <Form
      className={css("w-full")}
      onSubmit={(values, form) => onSubmit(values).then(() => form.reset())}
    >
      <TextInput
        block
        type={"textarea"}
        name={"body"}
        placeholder={"What are your thoughts?"}
        // validate={required}
        label={
          isReply ? undefined : (
            <>
              {AppStore.auth.address ? (
                <span>
                  <Text size={TextSize.sm}>{replyOrComment} as </Text>
                  <Link
                    href={`/profile/${AppStore.auth.address}/meme`}
                    type={LinkType.Secondary}
                  >
                    <Text type={TextType.NoColor} size={TextSize.sm}>
                      {AppStore.auth.profile?.ens
                        ? AppStore.auth.profile.ens
                        : abbreviate(AppStore.auth.address)}
                    </Text>
                  </Link>
                </span>
              ) : (
                <Text size={TextSize.sm}>{replyOrComment}</Text>
              )}
            </>
          )
        }
      />
      <div className={css("flex", "justify-end", "mt-2", "gap-2")}>
        {onCancel && (
          <Button onClick={() => onCancel()}>
            <Text size={TextSize.sm}>Cancel</Text>
          </Button>
        )}
        <Submit>{replyOrComment}</Submit>
      </div>
    </Form>
  );
});

const MemeComment: React.FC<{
  comment: Comment;
  onCommentSubmit: (body: string) => Promise<void>;
  store: MemeIdStore;
  isRootNode?: boolean;
}> = ({ onCommentSubmit, comment, store, isRootNode }) => {
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
  const commentReply = store.getReplies(comment.id);
  return (
    <div
      key={`comment-${comment.id}`}
      className={css(
        "text-xs",
        "bg-white",
        "p-2",
        "border-black",
        "flex",
        "w-full",
        "border-[1px]",
        "border-black",
        "dark:border-neutral-600",
        "dark:bg-neutral-900",
        "pr-0",
        {
          "pb-0": commentReply?.length > 0,
          "border-r-0 border-b-0": !isRootNode,
        }
      )}
    >
      <div className={css("grow")}>
        <div className={css("flex", "items-center")}>
          <Link
            type={LinkType.Secondary}
            href={`/profile/${comment.user.address}/meme`}
          >
            <Text type={TextType.NoColor} size={TextSize.xs}>
              {comment.user.ens
                ? comment.user.ens
                : abbreviate(comment.user.address)}
            </Text>
          </Link>
          <Text size={TextSize.xs} type={TextType.Grey}>
            <BsDot />
          </Text>
          <Text size={TextSize.xs} type={TextType.Grey}>
            {diffFormatted} ago
          </Text>
        </div>
        <Text>{comment.body}</Text>
        <div className={css("flex", "justify-start")}>
          <button
            className={css(
              "hover:underline",
              "text-neutral-400",
              "dark:text-neutral-600"
            )}
            onClick={() => setShowReply(!showReply)}
          >
            <Text size={TextSize.xs} type={TextType.Grey}>
              {showReply ? "Cancel" : "Reply"}
            </Text>
          </button>
        </div>
        {showReply && (
          <div className={css("mt-3")}>
            <CommentForm
              isReply
              onCancel={() => setShowReply(false)}
              onSubmit={({ body }) =>
                onCommentSubmit(body).then(() => setShowReply(false))
              }
            />
          </div>
        )}
        {commentReply && (
          <div className={css("flex", "flex-col", "gap-2", "mt-2")}>
            {commentReply.map((reply) => (
              <MemeComment
                isRootNode={false}
                key={`comment-${reply.id}`}
                store={store}
                comment={reply}
                onCommentSubmit={(body) =>
                  store.onParentCommentSubmit(body, reply.id)
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<MemeByIdProps> = async (
  context
) => {
  const { id } = context.query;
  try {
    const { data: meme } = await Http.getMeme(id as string);
    return {
      props: { meme },
    };
  } catch (e) {
    return redirectTo404();
  }
};

export default MemeById;
