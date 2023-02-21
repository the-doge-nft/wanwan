import { PropsWithChildren } from "react";
import { css } from "../../helpers/css";
import Link from "../DSL/Link/Link";
import Text, { TextSize, TextType } from "../DSL/Text/Text";
import { borderColorCss } from "../DSL/Theme";

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
    <div className={css("group")}>
      <Link href={link} className={css("w-full")}>
        <div
          className={css(
            "max-w-full",
            "h-full",
            "border-[1px]",
            "h-[115px]",
            "overflow-y-hidden",
            borderColorCss,
            "group-hover:border-red-600"
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
            "group-hover:text-red-600"
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
            "group-hover:text-red-600"
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
