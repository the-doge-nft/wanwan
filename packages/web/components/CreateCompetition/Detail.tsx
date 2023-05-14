import { ReactNode } from "react";
import { css } from "../../helpers/css";
import Text, { TextType } from "../DSL/Text/Text";

// @next -- such a bad name
const Detail = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className={css(
        "p-8",
        "text-center",
        "border-dashed",
        "border-[1px]",
        "border-neutral-400",
        "dark:border-neutral-700",
        "my-2"
      )}
    >
      <Text type={TextType.Primary}>{children}</Text>
    </div>
  );
};

export default Detail;
