import { observer } from "mobx-react-lite";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import Code from "../../components/DSL/Code/Code";
import { DevToggle } from "../../components/DSL/Dev/Dev";
import { css } from "../../helpers/css";
import { jsonify } from "../../helpers/strings";
import { Competition } from "../../interfaces";
import AppLayout from "../../layouts/App.layout";
import http from "../../services/http";
import CompetitionIdStore from "../../store/CompetitionId.store";

interface CompetitionByIdProps {
  competition: Competition;
}

const MemeById: React.FC<Competition> = observer(({ ...competition }) => {
  const {
    query: { id },
  } = useRouter();
  const store = useMemo(() => new CompetitionIdStore(id as string), [id]);
  useEffect(() => {
    store.init();
  }, [store]);
  return (
    <AppLayout>
      <div className={css("mt-4")}>
        {/* <div className={css("px-24")}>
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
        </div> */}
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
            {competition.name && (
              <div className={css("font-bold", "break-words")}>
                {competition.name}
              </div>
            )}
            {competition.description && (
              <div className={css("break-words")}>
                {competition.description}
              </div>
            )}
          </div>
          <div
            className={css("md:col-span-2", "flex", "justify-end", "items-end")}
          >
            {/* <Link href={`/profile/${meme.user.address}`}>
              {abbreviate(meme.user.address)}
            </Link> */}
          </div>
        </div>

        <DevToggle>
          <Code>{jsonify(competition)}</Code>
        </DevToggle>
      </div>
    </AppLayout>
  );
});

// const MemeComment: React.FC<
//   Comment & { onCommentSubmit: (body: string) => Promise<void> }
// > = ({ onCommentSubmit, ...comment }) => {
//   const [showReply, setShowReply] = useState(false);
//   return (
//     <div key={`comment-${comment.id}`} className={css("text-xs")}>
//       <div className={css("flex", "items-center")}>
//         <div></div>
//         <div>{abbreviate(comment.user.address)}</div>
//         <div className={css("flex", "items-center", "text-slate-600")}>
//           <BsDot />
//           <div>
//             {Math.abs(
//               new Date(comment.createdAt).getTime() - new Date().getTime()
//             ) / 36e5}
//           </div>
//         </div>
//       </div>
//       <div className={css("text-sm")}>{comment.body}</div>
//       <div>
//         <Button onClick={() => setShowReply(!showReply)}>reply</Button>
//       </div>
//       {showReply && (
//         <Form
//           onSubmit={({ body }) =>
//             onCommentSubmit(body).then(() => setShowReply(false))
//           }
//         >
//           <TextInput type={"textarea"} name={"body"} label={"reply as ___"} />
//           <Submit>Reply</Submit>
//         </Form>
//       )}
//     </div>
//   );
// };

export const getServerSideProps: GetServerSideProps<
  CompetitionByIdProps
> = async (context) => {
  const { id } = context.query;
  try {
    const { data: competition } = await http.get(`/competition/${id}`);
    return {
      props: competition,
    };
  } catch (e) {
    console.error(e);
    return { props: null };
  }
};

export default MemeById;
