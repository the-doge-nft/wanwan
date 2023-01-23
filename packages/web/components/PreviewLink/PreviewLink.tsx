import { PropsWithChildren } from "react";
import { css } from "../../helpers/css";
import Link from "../DSL/Link/Link";

interface PreviewLinkProps {
  link: string;
  name?: string | null;
  description?: string | null;
  showDetails?: boolean;
}

const PreviewLink: React.FC<PropsWithChildren<PreviewLinkProps>> = ({
  link,
  name,
  description,
  children,
  showDetails = true,
}) => {
  return (
    <div className={css("group")}>
      <Link href={link} className={css("w-full")}>
        <div
          className={css(
            "max-w-full",
            "h-full",
            "group-hover:border-slate-500",
            "dark:group-hover:border-neutral-700",
            "group-hover:text-slate-500",
            "dark:group-hover:text-neutral-200",
            "border-[1px]",
            "h-[115px]",
            "overflow-y-hidden",
            "border-black",
            "bg-slate-200",
            "dark:bg-neutral-800"
          )}
        >
          {children}
        </div>
      </Link>
      {showDetails && (
        <div className={css("text-xs", "group-hover:text-slate-500")}>
          {name && (
            <div
              className={css(
                "font-bold",
                "whitespace-nowrap",
                "overflow-hidden",
                "overflow-ellipsis",
                "dark:text-white"
              )}
            >
              {name}
            </div>
          )}
          {description && (
            <div
              className={css(
                "text-slate-700",
                "whitespace-nowrap",
                "overflow-hidden",
                "overflow-ellipsis",
                "group-hover:text-slate-500",
                "dark:text-neutral-300",
                "dark:group-hover:text-neutral-500"
              )}
            >
              {description}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PreviewLink;
