import { PropsWithChildren } from "react";
import { css } from "../../helpers/css";
import Link from "../DSL/Link/Link";

interface PreviewLinkProps {
  link: string;
  name?: string | null;
  description?: string | null;
}

const PreviewLink: React.FC<PropsWithChildren<PreviewLinkProps>> = ({
  link,
  name,
  description,
  children,
}) => {
  return (
    <div>
      <Link href={link} className={css("w-full")}>
        <div
          className={css(
            "max-w-full",
            "h-full",
            "hover:border-red-700",
            "border-[1px]",
            "h-[115px]",
            "overflow-y-hidden",
            "border-slate-900"
          )}
        >
          {children}
        </div>
      </Link>
      <div className={css("text-xs")}>
        {name && (
          <div
            className={css(
              "font-bold",
              "whitespace-nowrap",
              "overflow-hidden",
              "overflow-ellipsis"
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
              "overflow-ellipsis"
            )}
          >
            {description}
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewLink;
