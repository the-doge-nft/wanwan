import NextLink from "next/link";
import React from "react";
import { BsArrowUpRight } from "react-icons/bs";
import { css } from "../../../helpers/css";

export enum LinkType {
  Primary = "primary",
  Secondary = "secondary",
  Tertiary = "tertiary",
}

const baseLinkStyles = css(
  "hover:underline",
  "hover:cursor-pointer",
  "max-w-full"
);

export const linkTypeStyles = {
  [LinkType.Primary]: css("text-red-800", "hover:underline"),
  [LinkType.Secondary]: css(
    "text-black",
    "hover:underline",
    "dark:text-white",
    "hover:text-red-800",
    "dark:hover:text-red-800"
  ),
  [LinkType.Tertiary]: css(
    "text-neutral-500",
    "hover:text-neutral-800",
    "dark:text-neutral-500",
    "dark:hover:text-white"
  ),
};

interface LinkProps {
  isExternal?: boolean;
  href: string;
  children?: any;
  type?: LinkType;
  onClick?: () => void;
  className?: string;
  hideExternalIcon?: boolean;
}

const Link: React.FC<LinkProps> = ({
  isExternal,
  href,
  children,
  type = LinkType.Primary,
  onClick,
  className,
  hideExternalIcon = false,
}: LinkProps) => {
  const styles = css(
    linkTypeStyles[type],
    baseLinkStyles,
    "inline-block",
    className
  );

  return (
    <>
      {isExternal ? (
        <a
          href={href}
          className={css(styles, "items-center", "inline-flex")}
          target={isExternal ? "_blank" : "_self"}
          rel={"noreferrer"}
          onClick={onClick}
        >
          {children && children}
          {isExternal && !hideExternalIcon && (
            <BsArrowUpRight
              size={14}
              className={css({ "ml-0.5": !!children })}
            />
          )}
        </a>
      ) : (
        <NextLink
          href={href}
          className={css(styles, "inline")}
          onClick={onClick}
        >
          {children}
        </NextLink>
      )}
    </>
  );
};

export default Link;
