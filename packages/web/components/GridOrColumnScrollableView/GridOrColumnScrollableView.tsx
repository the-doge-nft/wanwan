import { observer } from "mobx-react-lite";
import { ReactNode } from "react";
import { TfiLayoutGrid2Alt } from "react-icons/tfi";
import { css } from "../../helpers/css";
import GridOrColumnScrollableStore, {
  View,
} from "../../store/GridOrColumnScrollable.store";
import AspectRatio from "../DSL/AspectRatio/AspectRatio";
import AsyncGrid from "../DSL/AsyncGrid/AsyncGrid";
import InfiniteScroll from "../DSL/InfiniteScroll/InfiniteScroll";
import Pane from "../DSL/Pane/Pane";

interface GridOrColumnScrollableViewProps<T> {
  title: string;
  store: GridOrColumnScrollableStore<T>;
  renderColumnItem: (item: T) => ReactNode;
  renderGridItem: (item: T) => ReactNode;
}

const GridOrColumnScrollableView = observer(
  <T extends unknown>({
    title,
    store,
    renderColumnItem,
    renderGridItem,
  }: GridOrColumnScrollableViewProps<T>) => {
    return (
      <div className={css("flex", "flex-col", "gap-2")}>
        <Pane
          title={title}
          rightOfTitle={
            <div className={css("flex", "items-center", "gap-2")}>
              <div
                className={css("cursor-pointer")}
                onClick={() => (store.view = View.Column)}
              >
                <AspectRatio
                  ratio={"1/1.5"}
                  className={css("w-[12px]", {
                    "bg-slate-700 dark:bg-slate-400":
                      store.view === View.Column,
                    "bg-slate-400 dark:bg-slate-700": store.view === View.Grid,
                  })}
                />
              </div>
              <div
                className={css("cursor-pointer", {
                  "text-slate-700 dark:text-slate-400":
                    store.view === View.Grid,
                  "text-slate-400 dark:text-slate-700":
                    store.view === View.Column,
                })}
                onClick={() => (store.view = View.Grid)}
              >
                <TfiLayoutGrid2Alt size={18} />
              </div>
            </div>
          }
        />
        <InfiniteScroll
          next={() => store.next()}
          dataLength={store.dataLength}
          hasMore={store.hasMore}
        >
          {store.view === View.Column && (
            <div className={css("flex", "flex-col", "gap-2")}>
              {store.data.map((item) => renderColumnItem(item))}
            </div>
          )}
          {store.view === View.Grid && (
            <AsyncGrid isLoading={store.isLoading} data={store.data}>
              {store.data.map((item) => renderGridItem(item))}
            </AsyncGrid>
          )}
        </InfiniteScroll>
      </div>
    );
  }
);
export default GridOrColumnScrollableView;
