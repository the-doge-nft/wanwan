import { ReactNode } from "react";
import { TfiLayoutGrid2Alt } from "react-icons/tfi";
import { css } from "../../helpers/css";
import GridOrColumnScrollableStore, {
  View,
} from "../../store/GridOrColumnScrollable.store";
import AspectRatio from "../DSL/AspectRatio/AspectRatio";
import AsyncGrid from "../DSL/AsyncGrid/AsyncGrid";
import InfiniteScroll from "../DSL/InfiniteScroll/InfiniteScroll";
import Text from "../DSL/Text/Text";

interface GridOrColumnScrollableViewProps<T> {
  title: string;
  store: GridOrColumnScrollableStore<T>;
  renderColumnItem: (item: T) => ReactNode;
  renderGridItem: (item: T) => ReactNode;
}

export default function GridOrColumnScrollableView<T>({
  title,
  store,
  renderColumnItem,
  renderGridItem,
}: GridOrColumnScrollableViewProps<T>) {
  return (
    <>
      <div
        className={css(
          "flex",
          "items-center",
          "gap-2",
          "justify-between",
          "mb-2",
          "border-[1px]",
          "border-black",
          "dark:border-neutral-700",
          "p-1",
          "bg-slate-300",
          "dark:bg-slate-800"
        )}
      >
        <Text bold>{title}</Text>
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
              "text-slate-400 dark:text-slate-700": store.view === View.Column,
            })}
            onClick={() => (store.view = View.Grid)}
          >
            <TfiLayoutGrid2Alt size={18} />
          </div>
        </div>
      </div>
      <InfiniteScroll
        next={() => store.next()}
        dataLength={store.dataLength}
        hasMore={store.hasMore}
      >
        {store.view === View.Column &&
          store.data.map((item) => renderColumnItem(item))}
        {store.view === View.Grid && (
          <AsyncGrid isLoading={store.isLoading} data={store.data}>
            {store.data.map((item) => renderGridItem(item))}
          </AsyncGrid>
        )}
      </InfiniteScroll>
    </>
  );
}
