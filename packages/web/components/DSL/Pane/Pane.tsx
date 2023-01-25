import { PropsWithChildren } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { css } from "../../../helpers/css";
import { borderColorCss } from "../Theme";

export enum PaneType {
  Primary = "primary",
  Secondary = "secondary",
}

interface PaneProps {
  title?: React.ReactNode;
  type?: PaneType;
  toggle?: boolean;
  isExpanded?: boolean;
  onChange?: (isExpanded: boolean) => void;
  className?: string;
}

const paneTypeStyles = {
  [PaneType.Primary]: {
    title: css(
      "bg-slate-300",
      "text-slate-900",
      "dark:bg-slate-800",
      "dark:text-slate-300"
    ),
    container: css("bg-slate-100", "border-[1px]"),
    body: css("text-slate-900"),
  },
  [PaneType.Secondary]: {
    title: css("bg-red-800", "text-white"),
    container: css(),
    body: css(),
  },
};

const Pane: React.FC<PropsWithChildren<PaneProps>> = ({
  children,
  title,
  type = PaneType.Primary,
  toggle,
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
      "text-sm",
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
          <div className={css("grow")}>{title}</div>
          {toggle && (
            <div
              className={css("cursor-pointer")}
              onClick={() => onChange && onChange(!isExpanded)}
            >
              {isExpanded ? (
                <AiOutlineMinus size={16} />
              ) : (
                <AiOutlinePlus size={16} />
              )}
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
