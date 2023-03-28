import { PropsWithChildren } from "react";
import { css } from "../helpers/css";

const BlankLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className={css("flex", "justify-center")}>
      <div
        className={css(
          "max-w-3xl",
          "w-full",
          "px-3",
          "pb-3",
          "flex",
          "flex-col"
        )}
      >
        <div className={css("flex-grow", "flex")}>{children}</div>
      </div>
    </div>
  );
};

export default BlankLayout;
