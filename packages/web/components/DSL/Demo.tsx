import { PropsWithChildren } from "react";
import { css } from "../../helpers/css";

export const Demo: React.FC<PropsWithChildren<{ title?: string }>> = ({
  children,
  title,
}) => {
  return (
    <div className={css("border-[1px]", "border-black", "p-2", "bg-gray-100")}>
      {title && <div className={css("text-sm", "italic", "mb-1")}>{title}</div>}
      <div>{children}</div>
    </div>
  );
};
