import { observer } from "mobx-react-lite";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import Link, { LinkType } from "../components/DSL/Link/Link";
import Pane, { PaneType } from "../components/DSL/Pane/Pane";
import Text from "../components/DSL/Text/Text";
import GridOrColumnScrollableView from "../components/GridOrColumnScrollableView/GridOrColumnScrollableView";
import MemeShareIcons from "../components/MemeShareIcons/MemeShareIcons";
import MemePreviewLink from "../components/PreviewLink/MemePreviewLink";
import env from "../environment";
import { css } from "../helpers/css";
import { abbreviate } from "../helpers/strings";
import { Meme, NextString, SearchParams } from "../interfaces";
import AppLayout from "../layouts/App.layout";
import Http from "../services/http";
import redirectTo404 from "../services/redirect/404";
import AppStore from "../store/App.store";
import MemePageStore from "../store/MemePage.store";

interface MemesPageProps {
  memes: Meme[];
  params: SearchParams;
  next?: NextString;
}

const MemePage = observer(({ memes, params, next }: MemesPageProps) => {
  const store = useMemo(
    () => new MemePageStore(memes, next, params),
    [memes, params, next]
  );
  useEffect(() => {
    store.init();
  }, []);
  return (
    <>
      <Head>
        <title>Memes - {env.app.name}</title>
      </Head>
      <AppLayout>
        <GridOrColumnScrollableView<Meme>
          title={"Memes"}
          store={store}
          renderColumnItem={(meme) => (
            <ColumnItem
              key={`meme-preview-${meme.id}`}
              meme={meme}
              onLikeClick={() => store.toggleLike(meme.id)}
            />
          )}
          renderGridItem={(meme) => (
            <MemePreviewLink key={`meme-preview-${meme.id}`} meme={meme} />
          )}
        />
      </AppLayout>
    </>
  );
});
interface ColumnItemProps {
  meme: Meme;
  onLikeClick: (memeId: number) => void;
}

const ColumnItem = observer(({ meme, onLikeClick }: ColumnItemProps) => {
  return (
    <Pane
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
              {meme.user.ens ? meme.user.ens : abbreviate(meme.user.address)}
            </Link>
          </div>
        </div>
      }
    >
      <Link href={`/meme/${meme.id}`} className={css("w-full", "relative")}>
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
          unoptimized={meme.media.url.split(".").pop()?.toLowerCase() === "gif"}
        />
      </Link>
      <div className={css("flex", "justify-end", "mt-2")}>
        <MemeShareIcons
          meme={meme}
          likes={meme.likes}
          onClickLike={() => onLikeClick(meme.id)}
          isLiked={AppStore.auth.memeIdsLiked.includes(meme.id)}
        />
      </div>
    </Pane>
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

export default MemePage;
