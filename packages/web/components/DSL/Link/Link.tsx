import NextLink from "next/link";
import React from "react";
import { BsArrowUpRight } from "react-icons/bs";
import { css } from "../../../helpers/css";

interface LinkProps {
  isExternal?: boolean;
  href: string;
  children?: any;
  type?: LinkType;
  size?: LinkSize;
  onClick?: () => void;
  className?: string;
}

const Link: React.FC<LinkProps> = ({
  isExternal,
  href,
  children,
  type = LinkType.Primary,
  size = LinkSize.sm,
  onClick,
  className,
}: LinkProps) => {
  const styles = css(
    linkTypeStyles[type],
    linkSizeStyles[size],
    "inline-block",
    className
  );

  return (
    <>
      {isExternal ? (
        <a
          href={href}
          className={css(styles, "items-center")}
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

export enum LinkType {
  Primary = "primary",
  Secondary = "secondary",
}

export enum LinkSize {
  sm = "sm",
  lg = "lg",
}

const baseLinkStyles = css(
  "hover:underline",
  "hover:cursor-pointer",
  "max-w-full"
);

const linkTypeStyles = {
  [LinkType.Primary]: css("text-red-700", "hover:text-red-600", baseLinkStyles),
  [LinkType.Secondary]: css("text-pixels-yellow-500", baseLinkStyles),
};

const linkSizeStyles = {
  [LinkSize.sm]: css("text-md"),
  [LinkSize.lg]: css("text-lg"),
};

export default Link;
