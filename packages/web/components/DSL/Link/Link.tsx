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

const linkTypeStyles = {
  [LinkType.Primary]: css("text-red-800", "hover:text-red-600"),
  [LinkType.Secondary]: css(
    "text-black",
    "hover:text-red-600",
    "dark:text-white",
    "dark:hover:text-red-600"
  ),
  [LinkType.Tertiary]: css("text-neutral-800", "hover:text-neutral-400"),
};

interface LinkProps {
  isExternal?: boolean;
  href: string;
  children?: any;
  type?: LinkType;
  onClick?: () => void;
  className?: string;
}

const Link: React.FC<LinkProps> = ({
  isExternal,
  href,
  children,
  type = LinkType.Primary,
  onClick,
  className,
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
          {isExternal && <BsArrowUpRight size={14} className={css("ml-0.5")} />}
        </a>
      ) : (
        <NextLink href={href} className={css(styles)} onClick={onClick}>
          {children}
        </NextLink>
      )}
    </>
  );
};

export default Link;
