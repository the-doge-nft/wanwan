import { PropsWithChildren } from "react";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import { css } from "../helpers/css";

const AppLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className={css("flex", "justify-center")}>
      <div
        className={css(
          "flex",
          "flex-col",
          "max-w-3xl",
          "w-full",
          "px-3",
          "pb-3"
        )}
      >
        <div className={css("py-3")}>
          <Header />
        </div>
        <div className={css("flex-grow", "flex", "flex-col")}>{children}</div>
        <Footer />
      </div>
    </div>
  );
};

export default AppLayout;
