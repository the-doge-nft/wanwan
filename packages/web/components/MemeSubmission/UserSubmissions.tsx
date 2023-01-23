import { css } from "../../helpers/css";
import CompetitionIdStore from "../../store/CompetitionId.store";
import AspectRatio from "../DSL/AspectRatio/AspectRatio";
import AsyncWrap, { NoDataFound } from "../DSL/AsyncWrap/AsyncWrap";
import PreviewLink from "../PreviewLink/PreviewLink";

const UserSubmissions: React.FC<{ store: CompetitionIdStore }> = ({
  store,
}) => {
  return (
    <div
      className={css("grid", "grid-rows-[min-content]", "gap-2")}
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
      }}
    >
      <AsyncWrap
        isLoading={false}
        hasData={store.userSubmittedMemes.length > 0}
        renderNoData={() => <NoDataFound>No memes found</NoDataFound>}
      >
        {store.userSubmittedMemes.map((meme) => {
          const place = store.getMemePlaceInCompetition(meme.id);
          return (
            <div
              key={`meme-preview-${meme.id}`}
              className={css("relative", "group")}
            >
              <PreviewLink link={`/meme/${meme.id}`}>
                <AspectRatio
                  className={css(
                    "bg-cover",
                    "bg-center",
                    "bg-no-repeat",
                    "w-full",
                    "h-full"
                  )}
                  ratio={`${meme.media.width}/${meme.media.height}`}
                  style={{ backgroundImage: `url(${meme.media.url})` }}
                />
                <div
                  className={css(
                    "absolute",
                    "top-0",
                    "left-0",
                    "p-1",
                    "mt-1.5",
                    "ml-1.5",
                    "bg-red-800",
                    "text-white",
                    "border-[1px]",
                    "border-black",
                    "text-xs",
                    "rounded-full",
                    "group-hover:bg-slate-300",
                    "group-hover:text-slate-500",
                    "group-hover:border-slate-500",
                    "leading-[0.6rem]"
                  )}
                >
                  {place}
                </div>
                <div>{meme.score}</div>
              </PreviewLink>
            </div>
          );
        })}
      </AsyncWrap>
    </div>
  );
};
export default UserSubmissions;
