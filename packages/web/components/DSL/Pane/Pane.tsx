import { PropsWithChildren } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { css } from "../../../helpers/css";
import Text, { TextType } from "../Text/Text";
import { borderColorCss } from "../Theme";

export enum PaneType {
  Primary = "primary",
  Secondary = "secondary",
}

interface PaneProps {
  title?: React.ReactNode;
  type?: PaneType;
  isExpanded?: boolean;
  onChange?: (isExpanded: boolean) => void;
  className?: string;
}

const paneTypeStyles = {
  [PaneType.Primary]: {
    title: css("bg-slate-300", "dark:bg-slate-800"),
    container: css("bg-slate-100", "border-[1px]"),
    body: css(),
  },
  [PaneType.Secondary]: {
    title: css("bg-red-800"),
    container: css(),
    body: css(),
  },
};

const Pane: React.FC<PropsWithChildren<PaneProps>> = ({
  children,
  title,
  type = PaneType.Primary,
  isExpanded = true,
  className,
  onChange,
}) => {
  const basePaneStyles = {
    container: css("border-[1px]", borderColorCss, className),
    title: css(
      "px-2",
      "py-1",
      "font-bold",
      "flex",
      "jusitfy-between",
      "items-center",
      "w-full"
    ),
    body: css("text-sm", { "p-2": children }),
  };
  return (
    <div
      className={
        (css(paneTypeStyles[type].container), basePaneStyles.container)
      }
    >
      {title && (
        <div className={css(paneTypeStyles[type].title, basePaneStyles.title)}>
          <div className={css("grow")}>
            <Text
              type={
                type === PaneType.Primary ? TextType.Primary : TextType.White
              }
            >
              {title}
            </Text>
          </div>
          {onChange && (
            <div
              className={css("cursor-pointer")}
              onClick={() => onChange(!isExpanded)}
            >
              <Text type={TextType.White}>
                {isExpanded ? (
                  <AiOutlineMinus size={16} />
                ) : (
                  <AiOutlinePlus size={16} />
                )}
              </Text>
            </div>
          )}
        </div>
      )}
      {isExpanded && (
        <div className={css(paneTypeStyles[type].body, basePaneStyles.body)}>
          {children}
        </div>
      )}
    </div>
  );
};

export default Pane;
