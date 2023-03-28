import { css } from "../../helpers/css";
import Text, { TextSize, TextType } from "../DSL/Text/Text";

const ActivePill = () => {
  return (
    <span
      className={css(
        "rounded-full",
        "border-[1px]",
        "border-black",
        "dark:border-neutral-700",
        "px-1",
        "py-0.5",
        "bg-red-800",
        "inline-flex",
        "items-center"
      )}
    >
      <Text type={TextType.White} size={TextSize.xs}>
        active
      </Text>
    </span>
  );
};

export default ActivePill;
