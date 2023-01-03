import { PropsWithChildren } from "react";
import { css } from "../helpers/css";

const AppLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return <div className={css("p-3", "bg-indigo-100")}>{children}</div>;
};

export default AppLayout;
