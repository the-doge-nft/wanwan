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
  size = LinkSize.lg,
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
  Tertiary = "tertiary",
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
  [LinkType.Primary]: css("text-red-800", "hover:text-red-600", baseLinkStyles),
  [LinkType.Secondary]: css("text-black", "hover:text-red-800", baseLinkStyles),
  [LinkType.Tertiary]: css(
    "text-slate-800",
    "hover:text-slate-600",
    baseLinkStyles
  ),
};

const linkSizeStyles = {
  [LinkSize.sm]: css("text-xs"),
  [LinkSize.lg]: css("text-sm"),
};

export default Link;
