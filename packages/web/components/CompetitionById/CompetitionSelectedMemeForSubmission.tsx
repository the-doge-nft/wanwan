import { observer } from "mobx-react-lite";
import { AiOutlineMinus } from "react-icons/ai";
import { css } from "../../helpers/css";
import CompetitionIdStore from "../../store/CompetitionId.store";
import AspectRatio from "../DSL/AspectRatio/AspectRatio";
import Text, { TextSize, TextType } from "../DSL/Text/Text";

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
          "border-slate-400 dark:border-neutral-700": !store.isMemesToSubmitMax,
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
              "text-slate-600",
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

export default CompetitionSelectedMemeForSubmission;
