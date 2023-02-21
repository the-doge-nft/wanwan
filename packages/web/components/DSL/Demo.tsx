import { PropsWithChildren } from "react";
import { css } from "../../helpers/css";
import Text, { TextSize } from "./Text/Text";
import { bgColorCss } from "./Theme";

export const Demo: React.FC<PropsWithChildren<{ title?: string }>> = ({
  children,
  title,
}) => {
  return (
    <div
      className={css(
        "border-[1px]",
        "border-black",
        "dark:border-neutral-700",
        "p-2",
        bgColorCss
      )}
    >
      {title && (
        <div className={css("mb-1")}>
          <Text size={TextSize.lg} italic>
            {title}
          </Text>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};
