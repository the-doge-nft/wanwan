import NextLink from "next/link";
import React from "react";
import { GoLinkExternal } from "react-icons/go";
import { css } from "../../helpers/css";

interface LinkProps {
  isExternal?: boolean;
  href: string;
  children?: any;
  type?: LinkType;
  size?: LinkSize;
  onClick?: () => void;
}

const Link: React.FC<LinkProps> = ({
  isExternal,
  href,
  children,
  type = LinkType.Primary,
  size = LinkSize.sm,
  onClick,
}: LinkProps) => {
  const styles = css(linkTypeStyles[type], linkSizeStyles[size]);
  const conditionalStyles = css("inline-flex");

  return (
    <>
      {isExternal ? (
        <a
          href={href}
          className={css(styles, "items-center", conditionalStyles)}
          target={isExternal ? "_blank" : "_self"}
          rel={"noreferrer"}
          onClick={onClick}
        >
          {children && children}
          {isExternal && <GoLinkExternal size={15} className={css("ml-2")} />}
        </a>
      ) : (
        <NextLink href={href}>
          <span className={css(styles, conditionalStyles)} onClick={onClick}>
            {children && children}
          </span>
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
