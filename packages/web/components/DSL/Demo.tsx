import { PropsWithChildren } from "react";
import { css } from "../../helpers/css";
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
      {title && <div className={css("text-sm", "italic", "mb-1")}>{title}</div>}
      <div>{children}</div>
    </div>
  );
};
