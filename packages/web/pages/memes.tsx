import { observer } from "mobx-react-lite";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { useMemo } from "react";
import { TfiLayoutGrid2Alt } from "react-icons/tfi";
import AspectRatio from "../components/DSL/AspectRatio/AspectRatio";
import AsyncGrid from "../components/DSL/AsyncGrid/AsyncGrid";
import InfiniteScroll from "../components/DSL/InfiniteScroll/InfiniteScroll";
import Link, { LinkType } from "../components/DSL/Link/Link";
import Pane, { PaneType } from "../components/DSL/Pane/Pane";
import Text from "../components/DSL/Text/Text";
import MemePreviewLink from "../components/PreviewLink/MemePreviewLink";
import { css } from "../helpers/css";
import { abbreviate } from "../helpers/strings";
import { Meme, NextString, SearchParams } from "../interfaces";
import AppLayout from "../layouts/App.layout";
import Http from "../services/http";
import redirectTo404 from "../services/redirect/404";
import MemePageStore, { View } from "../store/MemePage.store";

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

  const renderColumnView = () => {
    return (
      <div className={css("flex", "flex-col", "gap-2")}>
        {store.data.map((meme) => (
          <Pane
            key={`meme-preview-${meme.id}`}
            type={PaneType.Grey}
            title={
              <div
                className={css("flex", {
                  "justify-between": meme.name,
                  "justify-end": !meme.name,
                })}
              >
                {meme.name && <Text bold>{meme.name}</Text>}
                <div>
                  <Text>Posted by </Text>
                  <Link
                    type={LinkType.Secondary}
                    href={`/profile/${meme.user.address}/meme`}
                  >
                    {meme.user.ens
                      ? meme.user.ens
                      : abbreviate(meme.user.address)}
                  </Link>
                </div>
              </div>
            }
          >
            <Link
              href={`/meme/${meme.id}`}
              className={css("w-full", "relative")}
            >
              <Image
                src={meme.media.url}
                alt={meme.media.url}
                width={meme.media.width}
                height={meme.media.height}
                className={css(
                  "group-hover:border-red-800",
                  "hover:border-red-800",
                  "border-[1px]",
                  "border-black",
                  "w-full"
                )}
                unoptimized={
                  meme.media.url.split(".").pop()?.toLowerCase() === "gif"
                }
              />
            </Link>
          </Pane>
        ))}
      </div>
    );
  };

  const renderGridView = () => {
    return (
      <AsyncGrid isLoading={false} data={store.data}>
        {store.data.map((meme) => (
          <MemePreviewLink key={`meme-preview-${meme.id}`} meme={meme} />
        ))}
      </AsyncGrid>
    );
  };
  return (
    <AppLayout>
      <Pane
        title={"Memes"}
        rightOfTitle={
          <div className={css("flex", "items-center", "gap-2")}>
            <div
              className={css("cursor-pointer")}
              onClick={() => (store.view = View.Column)}
            >
              <AspectRatio
                ratio={"1/1.5"}
                className={css("w-[12px]", {
                  "bg-slate-700 dark:bg-slate-400": store.view === View.Column,
                  "bg-slate-400 dark:bg-slate-700": store.view === View.Grid,
                })}
              />
            </div>
            <div
              className={css("cursor-pointer", {
                "text-slate-700 dark:text-slate-400": store.view === View.Grid,
                "text-slate-400 dark:text-slate-700":
                  store.view === View.Column,
              })}
              onClick={() => (store.view = View.Grid)}
            >
              <TfiLayoutGrid2Alt size={18} />
            </div>
          </div>
        }
      >
        <InfiniteScroll
          next={() => store.next()}
          dataLength={store.dataLength}
          hasMore={store.hasMore}
          endDataMessage={`All memes shown (${store.dataLength})`}
        >
          {store.view === View.Column && renderColumnView()}
          {store.view === View.Grid && renderGridView()}
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
