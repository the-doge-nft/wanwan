import { PropsWithChildren } from "react";
import { css } from "../../../helpers/css";

export enum PaneType {
  Primary = "primary",
  Secondary = "secondary",
}

interface PaneProps {
  title?: string;
  type?: PaneType;
}

const basePaneStyles = {
  container: css("border-[1px]", "border-black"),
  title: css("p-1", "font-bold", "text-sm"),
  body: css("p-1", "text-sm"),
};

const paneTypeStyles = {
  [PaneType.Primary]: {
    title: css("bg-slate-300", "text-slate-900"),
    container: css("bg-slate-100", "border-[1px]", "border-black"),
    body: css(),
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
}) => {
  return (
    <div
      className={
        (css(paneTypeStyles[type].container), basePaneStyles.container)
      }
    >
      {title && (
        <div className={css(paneTypeStyles[type].title, basePaneStyles.title)}>
          {title}
        </div>
      )}
      <div className={css(paneTypeStyles[type].body, basePaneStyles.body)}>
        {children}
      </div>
    </div>
  );
};

export default Pane;
