import { observer } from "mobx-react-lite";
import { AiOutlinePlus } from "react-icons/ai";
import { css } from "../../helpers/css";
import AppStore from "../../store/App.store";
import CompetitionIdStore from "../../store/CompetitionId.store";
import AspectRatio from "../DSL/AspectRatio/AspectRatio";
import AsyncWrap from "../DSL/AsyncWrap/AsyncWrap";
import Button from "../DSL/Button/Button";

const CompetitionMemeSelector: React.FC<{ store: CompetitionIdStore }> =
  observer(({ store }) => {
    if (store.isMemesToSubmitMax) {
      return <></>;
    }

    return (
      <div
        className={css(
          "flex",
          "overflow-x-auto",
          "overflow-y-hidden",
          "gap-2",
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
                "w-full",
                "flex-col",
                "gap-4"
              )}
            >
              <Button
                onClick={() => (AppStore.modals.isCreateMemeModalOpen = true)}
              >
                <div className={css("flex", "items-center", "gap-0.5")}>
                  <AiOutlinePlus size={15} />
                  Meme
                </div>
              </Button>
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
                  "hover:border-slate-500",
                  "relative"
                )}
              >
                <AspectRatio
                  className={css("bg-cover", "bg-center", "bg-no-repeat")}
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
                    "text-neutral-500",
                    "items-center",
                    "justify-center",
                    "group-hover:bg-white",
                    "dark:group-hover:bg-neutral-900"
                  )}
                >
                  <div
                    className={css(
                      "border-[1px]",
                      "border-slate-500",
                      "text-neutral-500"
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
                  "text-neutral-600",
                  "group-hover:text-neutral-500"
                )}
              >
                {meme.name}
              </div>
            </div>
          ))}
        </AsyncWrap>
      </div>
    );
  });
export default CompetitionMemeSelector;
