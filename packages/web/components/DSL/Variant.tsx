import { PropsWithChildren } from "react";
import { css } from "../../helpers/css";

export const Variant: React.FC<
  PropsWithChildren<{ title: string; block?: boolean; className?: string }>
> = ({ title, children, block, className }) => {
  return (
    <div className={css({ "w-full": block }, className)}>
      <div className={css("text-xs", "text-gray-600", "mb-1")}>v: {title}</div>
      {children}
    </div>
  );
};
