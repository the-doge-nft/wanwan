import { JSONContent } from "@tiptap/react";
import { observer } from "mobx-react-lite";
import { useCallback } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { RxArrowDown, RxArrowUp } from "react-icons/rx";
import { css } from "../../helpers/css";
import { abbreviate } from "../../helpers/strings";
import AppStore from "../../store/App.store";
import CompetitionIdStore from "../../store/CompetitionById/CompetitionById.store";
import AspectRatio from "../DSL/AspectRatio/AspectRatio";
import AsyncWrap, { NoDataFound } from "../DSL/AsyncWrap/AsyncWrap";
import Link, { LinkType } from "../DSL/Link/Link";
import Pane, { PaneType } from "../DSL/Pane/Pane";
import Text, { TextSize, TextType } from "../DSL/Text/Text";
import TipTapEditor from "../TipTapEditor/TipTapEditor";

const CompetitionSubmissions: React.FC<{ store: CompetitionIdStore }> =
  observer(({ store }) => {
    const renderRightOfTitle = useCallback(
      (memeId: number) => {
        if (store.isUserCurator && store.isActive) {
          return (
            <button
              onClick={() => {
                store.setMemeToCurate(memeId);
              }}
              className={css(
                "text-black",
                "absolute",
                "right-[5px]",
                "top-[5xp]",
                "text-black",
                "dark:text-white",
                "border-[1px]",
                "border-black",
                "outline-none",
                "dark:border-white"
              )}
            >
              <IoCloseOutline size={18} />
            </button>
          );
        }
        return null;
      },
      [store.isUserCurator, store.setMemeToCurate]
    );
    return (
      <div className={css("flex", "flex-col", "gap-2")}>
        <AsyncWrap
          isLoading={false}
          hasData={store.memes.length > 0}
          renderNoData={() => <NoDataFound>No memes submitted</NoDataFound>}
        >
          {store.memes.map((meme, index) => {
            const score = meme.votes.reduce((acc, vote) => acc + vote.score, 0);
            const userVoteScore = meme.votes.find(
              (vote) => vote.user.id === AppStore.auth?.user?.id
            )?.score;
            const baseArrowStyles = css("text-neutral-500", {
              "hover:text-red-800 dark:hover:text-red-800":
                store.competition.isActive,
            });
            const scoreStyles = css(
              "text-black",
              "dark:text-white",
              "text-center",
              "font-bold",
              { "text-red-800": score < 0 }
            );
            let isDescriptionRichText = false;
            let description = meme.description;
            if (description) {
              try {
                description = JSON.parse(meme.description as string);
                isDescriptionRichText = true;
              } catch (e) {}
            }
            return (
              <div key={`meme-preview-${meme.id}`} className={css("relative")}>
                <Pane
                  rightOfTitle={renderRightOfTitle(meme.id)}
                  type={PaneType.Grey}
                  title={
                    <div
                      className={css(
                        "text-black",
                        "dark:text-white",
                        "items-center",
                        "flex",
                        "justify-between",
                        { "pr-5": store.isUserCurator }
                      )}
                    >
                      <div>
                        <Text type={TextType.NoColor}>Posted by </Text>
                        <Link
                          type={LinkType.Secondary}
                          href={`/profile/${meme.user.address}/meme`}
                        >
                          {meme.user.ens
                            ? meme.user.ens
                            : abbreviate(meme.user.address)}
                        </Link>
                      </div>
                      <Text type={TextType.Grey}>{index + 1}</Text>
                    </div>
                  }
                >
                  <div className={css("flex", "gap-2", "mr-2")}>
                    <div>
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          if (store.competition.isActive) {
                            AppStore.auth.runOrAuthPrompt(() =>
                              store.runIfCanVote(() => {
                                if (userVoteScore === 1) {
                                  store.runThenRefreshMemes(() =>
                                    store.zeroVote(meme.id)
                                  );
                                } else {
                                  store.runThenRefreshMemes(() =>
                                    store.upVote(meme.id)
                                  );
                                }
                              })
                            );
                          }
                        }}
                        className={css({
                          "text-black dark:text-white": userVoteScore === 1,
                          [baseArrowStyles]: userVoteScore !== 1,
                          "cursor-pointer": store.competition.isActive,
                        })}
                      >
                        <RxArrowUp size={22} />
                      </div>
                      <div className={css(scoreStyles)}>
                        <Text type={TextType.NoColor} size={TextSize.sm}>
                          {score}
                        </Text>
                      </div>
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          if (store.competition.isActive) {
                            AppStore.auth.runOrAuthPrompt(() =>
                              store.runIfCanVote(() => {
                                if (userVoteScore === -1) {
                                  store.runThenRefreshMemes(() =>
                                    store.zeroVote(meme.id)
                                  );
                                } else {
                                  store.runThenRefreshMemes(() =>
                                    store.downVote(meme.id)
                                  );
                                }
                              })
                            );
                          }
                        }}
                        className={css({
                          "text-black dark:text-white": userVoteScore === -1,
                          [baseArrowStyles]: userVoteScore !== -1,
                          "cursor-pointer": store.competition.isActive,
                        })}
                      >
                        <RxArrowDown size={22} />
                      </div>
                    </div>
                    <div className={css("grow")}>
                      <div className={css("flex", "flex-col")}>
                        <Text size={TextSize.sm} bold>
                          {meme.name}
                        </Text>
                        {isDescriptionRichText && description && (
                          <TipTapEditor
                            content={description as JSONContent}
                            border={false}
                            readonly
                          />
                        )}
                        {!isDescriptionRichText && description && (
                          <Text size={TextSize.sm}>
                            {meme.description as string}
                          </Text>
                        )}

                        <Link href={`/meme/${meme.id}`}>
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
                              "group-hover:border-red-800",
                              "hover:border-red-800"
                            )}
                            ratio={`${meme.media.width}/${meme.media.height}`}
                            style={{
                              backgroundImage: `url(${meme.media.url})`,
                            }}
                          />
                        </Link>

                        <div
                          className={css(
                            "flex",
                            "justify-end",
                            "items-center",
                            "mt-2.5"
                          )}
                        >
                          <Link
                            type={LinkType.Secondary}
                            href={`/meme/${meme.id}`}
                            className={css(
                              "inline-flex",
                              "items-center",
                              "gap-1"
                            )}
                          >
                            <Text size={TextSize.sm} type={TextType.NoColor}>
                              {meme.comments.length} comments
                            </Text>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </Pane>
                {/* </Link> */}
              </div>
            );
          })}
        </AsyncWrap>
      </div>
    );
  });

export default CompetitionSubmissions;
