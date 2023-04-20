import { PropsWithChildren } from "react";
import { css } from "../../helpers/css";
import Link from "../DSL/Link/Link";
import Text, { TextSize, TextType } from "../DSL/Text/Text";
import { borderColorCss } from "../DSL/Theme";

export interface PreviewLinkProps {
  href: string;
  name?: string | null;
  description?: string | null;
  isExternal?: boolean;
}

const PreviewLink: React.FC<PropsWithChildren<PreviewLinkProps>> = ({
  href: link,
  name,
  description,
  children,
  isExternal,
}) => {
  return (
    <div className={css("group")}>
      <Link isExternal={isExternal} href={link} className={css("w-full")}>
        <div
          className={css(
            "max-w-full",
            "border-[1px]",
            "h-[150px]",
            "overflow-y-hidden",
            borderColorCss,
            "group-hover:border-red-800",
            "grow",
            "relative"
          )}
        >
          {children}
        </div>
      </Link>
      {name && (
        <div
          className={css(
            "whitespace-nowrap",
            "overflow-hidden",
            "overflow-ellipsis",
            "text-black",
            "dark:text-white",
            "group-hover:text-red-800"
          )}
        >
          <Text type={TextType.NoColor} size={TextSize.sm}>
            {name}
          </Text>
        </div>
      )}
      {description && (
        <div
          className={css(
            "whitespace-nowrap",
            "overflow-hidden",
            "overflow-ellipsis",
            "text-neutral-400",
            "dark:text-neutral-600",
            "group-hover:text-red-800"
          )}
        >
          <Text size={TextSize.xs} type={TextType.NoColor}>
            {description}
          </Text>
        </div>
      )}
    </div>
  );
};

export default PreviewLink;
