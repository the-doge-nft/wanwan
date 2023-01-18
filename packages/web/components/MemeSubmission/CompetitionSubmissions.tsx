import { format } from "date-fns";
import { observer } from "mobx-react-lite";
import { RxArrowDown, RxArrowUp } from "react-icons/rx";
import { css } from "../../helpers/css";
import { abbreviate } from "../../helpers/strings";
import AppStore from "../../store/App.store";
import CompetitionIdStore from "../../store/CompetitionId.store";
import AspectRatio from "../DSL/AspectRatio/AspectRatio";
import AsyncWrap, { NoDataFound } from "../DSL/AsyncWrap/AsyncWrap";
import Link, { LinkSize, LinkType } from "../DSL/Link/Link";
import Pane from "../DSL/Pane/Pane";

const CompetitionSubmissions: React.FC<{ store: CompetitionIdStore }> =
  observer(({ store }) => {
    return (
      <div className={css("flex", "flex-col", "gap-2")}>
        <AsyncWrap
          isLoading={false}
          hasData={store.memes.length > 0}
          renderNoData={() => <NoDataFound>memes</NoDataFound>}
        >
          {store.memes.map((meme) => {
            const score = meme.votes.reduce((acc, vote) => acc + vote.score, 0);
            const userVoteScore = meme.votes.filter(
              (vote) => vote.user.address === AppStore.auth.address
            )[0]?.score;
            return (
              <Link
                className={css("hover:no-underline")}
                href={`/meme/${meme.id}`}
                key={`meme-preview-${meme.id}`}
              >
                <Pane
                  className={css(
                    "hover:border-slate-500",
                    "!hover:text-red-800",
                    "group"
                  )}
                  title={
                    <div className={css("group-hover:text-slate-500")}>
                      Posted by{" "}
                      <Link
                        className={css("group-hover:text-slate-500")}
                        type={LinkType.Secondary}
                        href={`/profile/${meme.user.address}/meme`}
                      >
                        {abbreviate(meme.user.address)}
                      </Link>
                    </div>
                  }
                >
                  <div className={css("flex", "gap-2", "mr-2")}>
                    <div>
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          AppStore.auth.runOrAuthPrompt(() => {
                            if (userVoteScore === 1) {
                              store.zeroVote(meme.id);
                            } else {
                              store.upVote(meme.id);
                            }
                          });
                        }}
                        className={css(
                          "text-slate-400",
                          "hover:text-slate-800",
                          "cursor-pointer",
                          { "text-slate-800": userVoteScore === 1 }
                        )}
                      >
                        <RxArrowUp size={22} />
                      </div>
                      <div
                        className={css("text-center", "font-bold", {
                          "text-slate-600": score > 0,
                          "text-slate-400": score === 0,
                        })}
                      >
                        {score}
                      </div>
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          AppStore.auth.runOrAuthPrompt(() => {
                            if (userVoteScore === -1) {
                              store.zeroVote(meme.id);
                            } else {
                              store.downVote(meme.id);
                            }
                          });
                        }}
                        className={css(
                          "text-slate-400",
                          "hover:text-slate-800",
                          "cursor-pointer",
                          {
                            "text-slate-800": userVoteScore === -1,
                          }
                        )}
                      >
                        <RxArrowDown size={22} />
                      </div>
                    </div>
                    <div className={css("grow")}>
                      <div
                        className={css(
                          "flex",
                          "flex-col",
                          "group-hover:text-slate-500"
                        )}
                      >
                        <div className={css("font-bold")}>{meme.name}</div>
                        <div>{meme.description}</div>
                        <AspectRatio
                          className={css(
                            "bg-contain",
                            "bg-center",
                            "bg-no-repeat",
                            "h-full",
                            "border-[1px]",
                            "border-black",
                            "mt-3",
                            "mb-2",
                            "group-hover:border-slate-500"
                          )}
                          ratio={`${meme.media.width}/${meme.media.height}`}
                          style={{ backgroundImage: `url(${meme.media.url})` }}
                        />
                        <div
                          className={css(
                            "flex",
                            "justify-between",
                            "items-center",
                            "mt-2.5",
                            "text-slate-500",
                            "group-hover:text-slate-500"
                          )}
                        >
                          <div className={css("text-xs")}>
                            {format(
                              new Date(meme.submissions[0].createdAt),
                              "Pp"
                            )}
                          </div>
                          <Link
                            type={LinkType.Tertiary}
                            size={LinkSize.sm}
                            href={`/meme/${meme.id}`}
                            className={css(
                              "inline-flex",
                              "items-center",
                              "gap-1",
                              "group-hover:text-slate-500",
                              "text-slate-900"
                            )}
                          >
                            <div>{meme.comments.length} comments</div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </Pane>
              </Link>
            );
          })}
        </AsyncWrap>
      </div>
    );
  });

export default CompetitionSubmissions;
