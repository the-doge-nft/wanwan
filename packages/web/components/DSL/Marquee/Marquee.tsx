import React, { PropsWithChildren } from "react";
import { css } from "../../../helpers/css";
import styles from "./Marquee.module.css";

interface MarqueProps {}

const Marquee: React.FC<PropsWithChildren<MarqueProps>> = ({ children }) => {
  return (
    <div
      className={css("overflow-x-hidden", "relative")}
      style={{
        transform: `translateZ(0)`,
      }}
    >
      <div className={css(styles["scroll-left"], "flex", "relative")}>
        {children}
      </div>
    </div>
  );
};

export default Marquee;
