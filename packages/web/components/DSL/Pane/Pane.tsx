import { PropsWithChildren } from "react";
import { css } from "../../../helpers/css";

export enum PaneType {
  Primary = "primary",
  Secondary = "secondary",
}

interface PaneProps {
  title?: React.ReactNode;
  type?: PaneType;
  rightOfTitle?: React.ReactNode;
}

const paneTypeStyles = {
  [PaneType.Primary]: {
    title: css("bg-slate-300", "text-slate-900"),
    container: css("bg-slate-100", "border-[1px]", "border-black"),
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
  rightOfTitle,
}) => {
  const basePaneStyles = {
    container: css("border-[1px]", "border-black"),
    title: css(
      "p-1",
      "font-bold",
      "text-sm",
      "flex",
      "jusitfy-between",
      "items-center",
      "w-full"
    ),
    body: css("text-sm", { "p-1": children }),
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
          {rightOfTitle && rightOfTitle}
        </div>
      )}
      <div className={css(paneTypeStyles[type].body, basePaneStyles.body)}>
        {children}
      </div>
    </div>
  );
};

export default Pane;
