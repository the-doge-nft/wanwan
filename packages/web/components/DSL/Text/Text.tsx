import { PropsWithChildren } from "react";
import { css } from "../../../helpers/css";

export enum TextSize {
  xs = "xs",
  sm = "sm",
  lg = "lg",
}

export enum TextType {
  Primary = "primary",
  Secondary = "secondary",
  Grey = "grey",
  White = "white",
  NoColor = "noColor",
}

interface TextProps {
  size?: TextSize;
  type?: TextType;
  bold?: boolean;
}

const textSizeStyles = {
  [TextSize.xs]: css("text-xs"),
  [TextSize.sm]: css("text-sm"),
  [TextSize.lg]: css("text-base"),
};

const textTypeStyles = {
  [TextType.Primary]: css("text-black", "dark:text-white"),
  [TextType.Secondary]: css(),
  [TextType.Grey]: css("text-slate-400", "dark:text-neutral-600"),
  [TextType.White]: css("text-white"),
  [TextType.NoColor]: css(),
};

const Text: React.FC<PropsWithChildren<TextProps>> = ({
  size = TextSize.lg,
  type = TextType.Primary,
  bold = false,
  children,
}) => {
  return (
    <span
      className={css(
        textSizeStyles[size],
        textTypeStyles[type],
        "break-words",
        {
          "font-bold": bold,
        }
      )}
    >
      {children}
    </span>
  );
};

export default Text;
