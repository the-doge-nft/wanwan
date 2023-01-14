import { observer } from "mobx-react-lite";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import AspectRatio from "../../components/DSL/AspectRatio/AspectRatio";
import AsyncWrap, {
  NoDataFound,
} from "../../components/DSL/AsyncWrap/AsyncWrap";
import Code from "../../components/DSL/Code/Code";
import { DevToggle } from "../../components/DSL/Dev/Dev";
import Input from "../../components/DSL/Input/Input";
import Pane, { PaneType } from "../../components/DSL/Pane/Pane";
import PreviewLink from "../../components/PreviewLink/PreviewLink";
import { css } from "../../helpers/css";
import { jsonify } from "../../helpers/strings";
import { Competition, Meme } from "../../interfaces";
import AppLayout from "../../layouts/App.layout";
import http from "../../services/http";
import CompetitionIdStore from "../../store/CompetitionId.store";

interface CompetitionByIdProps {
  competition: Competition;
  memes: Meme[];
}

const MemeById: React.FC<CompetitionByIdProps> = observer(
  ({ competition, memes }) => {
    const {
      query: { id },
    } = useRouter();

    const store = useMemo(
      () =>
        new CompetitionIdStore(id as string, competition, memes ? memes : []),
      [id, competition, memes]
    );

    useEffect(() => {
      store.init();
      return () => {
        store.destroy();
      };
    }, []);
    return (
      <AppLayout>
        <div className={css("mt-4")}>
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
              {store.competition.name && (
                <div className={css("font-bold", "break-words")}>
                  {competition.name}
                </div>
              )}
              {store.competition.description && (
                <div className={css("break-words")}>
                  {competition.description}
                </div>
              )}
              {store.competition.maxUserSubmissions && (
                <div>{store.competition.maxUserSubmissions}</div>
              )}
            </div>
          </div>

          {store.showSubmitPane && (
            <Pane
              type={PaneType.Secondary}
              title={"Submit"}
              rightOfTitle={
                <div
                  className={css("cursor-pointer")}
                  onClick={() => store.toggleShowSubmitContent()}
                >
                  {store.showSubmitContent ? (
                    <AiOutlineMinus size={16} />
                  ) : (
                    <AiOutlinePlus size={16} />
                  )}
                </div>
              }
            >
              {store.showSubmitContent && (
                <>
                  <div>
                    <Input
                      value={store.searchValue}
                      onChange={store.onSearchChange}
                      placeholder={"search yours"}
                      type={"text"}
                    />
                  </div>
                  <div
                    className={css(
                      "min-h-[154px]",
                      "border-[1px]",
                      "border-dashed",
                      "border-slate-700",
                      "flex",
                      "justify-center",
                      "items-center",
                      "my-2",
                      "p-4",
                      "gap-2"
                    )}
                  >
                    {store.selectedMemes.map((meme) => (
                      <div
                        onClick={() => store.onMemeDeselect(meme.id)}
                        key={`meme-preview-${meme.id}`}
                        className={css(
                          "flex",
                          "flex-col",
                          "gap-1",
                          "w-[100px]",
                          "shrink-0",
                          "group",
                          "cursor-pointer"
                        )}
                      >
                        <div
                          className={css(
                            "border-[1px]",
                            "border-black",
                            "hover:border-red-700",
                            "relative"
                          )}
                        >
                          <AspectRatio
                            className={css(
                              "bg-cover",
                              "bg-center",
                              "bg-no-repeat"
                            )}
                            ratio={"1/1"}
                            style={{
                              backgroundImage: `url(${meme.media.url})`,
                            }}
                          />
                          <div
                            className={css(
                              "absolute",
                              "inset-0",
                              "w-full",
                              "h-full",
                              "bg-[rgba(0, 0, 0, 0.61)]",
                              "hidden",
                              "group-hover:flex",
                              "text-red-400",
                              "items-center",
                              "justify-center",
                              "group-hover:bg-slate-100"
                            )}
                          >
                            <div
                              className={css(
                                "border-[1px]",
                                "border-red-800",
                                "text-red-800"
                              )}
                            >
                              <AiOutlineMinus size={20} />
                            </div>
                          </div>
                        </div>
                        <div
                          className={css(
                            "text-xs",
                            "break-words",
                            "whitespace-nowrap",
                            "overflow-hidden",
                            "overflow-ellipsis",
                            "text-slate-600",
                            "group-hover:text-red-800"
                          )}
                        >
                          {meme.name}
                        </div>
                      </div>
                    ))}
                    {!store.hasSelectedMemes && (
                      <div className={css("text-slate-700", "text-xs")}>
                        select at most: {store.competition.maxUserSubmissions}
                      </div>
                    )}
                  </div>
                  <div
                    className={css(
                      "flex",
                      "overflow-y-scroll",
                      "gap-3",
                      "min-h-[120px]"
                    )}
                  >
                    <AsyncWrap
                      isLoading={false}
                      hasData={store.filteredMemes.length > 0}
                      renderNoData={() => (
                        <div
                          className={css(
                            "flex",
                            "justify-center",
                            "items-center",
                            "w-full"
                          )}
                        >
                          <NoDataFound>memes</NoDataFound>
                        </div>
                      )}
                    >
                      {store.filteredMemes.map((meme) => (
                        <div
                          onClick={() => store.onMemeSelect(meme.id)}
                          key={`meme-preview-${meme.id}`}
                          className={css(
                            "flex",
                            "flex-col",
                            "gap-1",
                            "w-[100px]",
                            "shrink-0",
                            "group",
                            "cursor-pointer"
                          )}
                        >
                          <div
                            className={css(
                              "border-[1px]",
                              "border-black",
                              "hover:border-green-700",
                              "relative"
                            )}
                          >
                            <AspectRatio
                              className={css(
                                "bg-cover",
                                "bg-center",
                                "bg-no-repeat"
                              )}
                              ratio={"1/1"}
                              style={{
                                backgroundImage: `url(${meme.media.url})`,
                              }}
                            />
                            <div
                              className={css(
                                "absolute",
                                "inset-0",
                                "w-full",
                                "h-full",
                                "bg-[rgba(0, 0, 0, 0.61)]",
                                "hidden",
                                "group-hover:flex",
                                "text-green-400",
                                "items-center",
                                "justify-center",
                                "group-hover:bg-slate-100"
                              )}
                            >
                              <div
                                className={css(
                                  "border-[1px]",
                                  "border-green-800",
                                  "text-green-800"
                                )}
                              >
                                <AiOutlinePlus size={20} />
                              </div>
                            </div>
                          </div>
                          <div
                            className={css(
                              "text-xs",
                              "break-words",
                              "whitespace-nowrap",
                              "overflow-hidden",
                              "overflow-ellipsis",
                              "text-slate-600",
                              "group-hover:text-green-800"
                            )}
                          >
                            {meme.name}
                          </div>
                        </div>
                      ))}
                    </AsyncWrap>
                  </div>
                </>
              )}
            </Pane>
          )}
          <div className={css("mt-3")}>
            <Pane title={"Entries"}>
              <div
                className={css(
                  "grid",
                  "grid-rows-[min-content]",
                  "gap-4",
                  "p-2"
                )}
                style={{
                  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                }}
              >
                <AsyncWrap
                  isLoading={false}
                  hasData={store.memes.length > 0}
                  renderNoData={() => <NoDataFound>memes</NoDataFound>}
                >
                  {store.memes.map((meme) => (
                    <div
                      key={`meme-preview-${meme.id}`}
                      className={css("max-w-[200px]")}
                    >
                      <PreviewLink
                        name={meme.name}
                        description={meme.description}
                        link={`/meme/${meme.id}`}
                      >
                        <AspectRatio
                          className={css(
                            "bg-cover",
                            "bg-center",
                            "bg-no-repeat",
                            "h-full"
                          )}
                          ratio={`${meme.media.width}/${meme.media.height}`}
                          style={{ backgroundImage: `url(${meme.media.url})` }}
                        />
                      </PreviewLink>
                    </div>
                  ))}
                </AsyncWrap>
              </div>
            </Pane>
          </div>
          <DevToggle>
            <Code>{jsonify(competition)}</Code>
          </DevToggle>
        </div>
      </AppLayout>
    );
  }
);

export const getServerSideProps: GetServerSideProps<
  CompetitionByIdProps
> = async (context) => {
  const { id } = context.query;
  try {
    const { data: competition } = await http.get<Competition>(
      `/competition/${id}`
    );
    const { data: memes } = await http.get<Meme[]>(
      `/competition/${id}/meme/ranked`
    );
    return {
      props: {
        competition,
        memes,
      },
    };
  } catch (e) {
    throw new Error();
  }
};

export default MemeById;
