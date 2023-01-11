import { PropsWithChildren } from "react";
import { css } from "../../../helpers/css";

interface DividerProps {
  orientation?: "vertical" | "horizontal";
}

const verticalStyles = css("h-full", "w-1", "border-l-2");
const horizontalStyles = css("w-full");

export const Divider: React.FC<PropsWithChildren<DividerProps>> = ({
  orientation = "horizontal",
}) => {
  return (
    <div
      className={css("border-slate-200", "border-t-[1px]", {
        [verticalStyles]: orientation === "vertical",
        [horizontalStyles]: orientation === "horizontal",
      })}
    />
  );
};
