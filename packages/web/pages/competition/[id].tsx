import { observer } from "mobx-react-lite";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import AspectRatio from "../../components/DSL/AspectRatio/AspectRatio";
import AsyncWrap, {
  NoDataFound,
} from "../../components/DSL/AsyncWrap/AsyncWrap";
import Code from "../../components/DSL/Code/Code";
import { DevToggle } from "../../components/DSL/Dev/Dev";
import Pane from "../../components/DSL/Pane/Pane";
import PreviewLink from "../../components/PreviewLink/PreviewLink";
import { css } from "../../helpers/css";
import { jsonify } from "../../helpers/strings";
import { Competition, Meme } from "../../interfaces";
import AppLayout from "../../layouts/App.layout";
import http from "../../services/http";
import CompetitionIdStore from "../../store/CompetitionId.store";

interface CompetitionByIdProps {
  competition: Competition | null;
  memes: Meme[] | null;
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
    }, [store]);
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
              {competition?.name && (
                <div className={css("font-bold", "break-words")}>
                  {competition.name}
                </div>
              )}
              {competition?.description && (
                <div className={css("break-words")}>
                  {competition.description}
                </div>
              )}
            </div>
            <Pane title={"Recent"}>
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
    console.error(e);
    return { props: { competition: null, memes: null } };
  }
};

export default MemeById;
