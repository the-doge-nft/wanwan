import { observer } from "mobx-react-lite";
import { GetServerSideProps } from "next";
import { useMemo } from "react";
import AspectRatio from "../components/DSL/AspectRatio/AspectRatio";
import AsyncGrid from "../components/DSL/AsyncGrid/AsyncGrid";
import InfiniteScroll from "../components/DSL/InfiniteScroll/InfiniteScroll";
import Pane from "../components/DSL/Pane/Pane";
import PreviewLink from "../components/PreviewLink/PreviewLink";
import { css } from "../helpers/css";
import { Meme, NextString, SearchParams } from "../interfaces";
import AppLayout from "../layouts/App.layout";
import Http from "../services/http";
import redirectTo404 from "../services/redirect/404";
import MemePageStore from "../store/MemePage.store";

interface MemesPageProps {
  memes: Meme[];
  params: SearchParams;
  next?: NextString;
}

const Memes = observer(({ memes, params, next }: MemesPageProps) => {
  const store = useMemo(
    () => new MemePageStore(memes, params, next),
    [memes, params, next]
  );
  return (
    <AppLayout>
      <Pane title={"Memes"}>
        <InfiniteScroll
          next={() => store.next()}
          dataLength={store.dataLength}
          hasMore={store.hasMore}
          endDataMessage={`All memes shown (${store.dataLength})`}
        >
          <AsyncGrid isLoading={false} data={store.data}>
            {store.data.map((meme) => (
              <div key={`meme-preview-${meme.id}`}>
                <PreviewLink link={`/meme/${meme.id}`}>
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
          </AsyncGrid>
        </InfiniteScroll>
      </Pane>
    </AppLayout>
  );
});

export const getServerSideProps: GetServerSideProps<
  MemesPageProps
> = async () => {
  const params: SearchParams = {
    count: 48,
    offset: 0,
    sorts: [{ key: "createdAt", direction: "desc" }],
    filters: [],
  };
  try {
    const {
      data: { data: memes, next },
    } = await Http.searchMeme(params);
    return {
      props: { memes, params, next },
    };
  } catch (e) {
    return redirectTo404();
  }
};

export default Memes;
