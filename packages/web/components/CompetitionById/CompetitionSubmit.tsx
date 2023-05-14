import { observer } from "mobx-react-lite";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { css } from "../../helpers/css";
import CompetitionIdStore from "../../store/CompetitionById/CompetitionById.store";
import AspectRatio from "../DSL/AspectRatio/AspectRatio";
import AsyncWrap from "../DSL/AsyncWrap/AsyncWrap";
import Button from "../DSL/Button/Button";
import Input from "../DSL/Input/Input";
import Text, { TextSize, TextType } from "../DSL/Text/Text";

interface CompetitionSubmitProps {
  store: CompetitionIdStore;
}

const CompetitionSubmit = observer(({ store }: CompetitionSubmitProps) => {
  return (
    <div className={css("flex", "flex-col", "gap-2")}>
      <div
        className={css(
          "flex",
          "justify-between",
          "align-items-center",
          "gap-2"
        )}
      >
        <Input
          block
          value={store.searchValue}
          onChange={store.onSearchChange}
          placeholder={"search your catalogue"}
          type={"text"}
        />
        <Button
          onClick={() => store.onSubmit()}
          isLoading={store.isSubmitLoading}
          disabled={!store.canSubmit}
        >
          Submit
        </Button>
      </div>
      <CompetitionMemeSelector store={store} />
      <CompetitionSelectedMemeForSubmission store={store} />
    </div>
  );
});

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
              <Button onClick={() => (store.isSubmitMemeModalOpen = true)}>
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
                  "hover:border-neutral-500",
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
                      "border-neutral-500",
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

const CompetitionSelectedMemeForSubmission: React.FC<{
  store: CompetitionIdStore;
}> = observer(({ store }) => {
  return (
    <div
      className={css(
        "min-h-[154px]",
        "border-[1px]",
        "border-dashed",
        "flex",
        "justify-center",
        "p-4",
        "gap-2",
        "flex",
        "overflow-y-hidden",
        "overflow-x-auto",
        {
          "border-neutral-400 dark:border-neutral-700":
            !store.isMemesToSubmitMax,
          "border-black dark:border-neutral-700": store.isMemesToSubmitMax,
          "items-start": store.selectedMemes.length > 0,
          "items-center": store.selectedMemes.length === 0,
        }
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
              "relative",
              "hover:border-red-800"
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
                "text-red-400",
                "items-center",
                "justify-center",
                "group-hover:bg-white",
                "dark:group-hover:bg-neutral-900"
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
              "text-neutral-600",
              "group-hover:text-red-800"
            )}
          >
            {meme.name}
          </div>
        </div>
      ))}
      {!store.hasSelectedMemes && (
        <Text size={TextSize.xs} type={TextType.Grey}>
          Select at most: {store.countMemeUserCanSubmit}
        </Text>
      )}
    </div>
  );
});

export default CompetitionSubmit;
