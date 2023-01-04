import Link from "../components/Link/Link";
import { css } from "../helpers/css";
import AppLayout from "../layouts/App.layout";

const Custom404 = () => {
  return (
    <AppLayout>
      <div
        className={css(
          "flex",
          "flex-col",
          "items-center",
          "justify-center",
          "h-full"
        )}
      >
        <div>¯\_(ツ)_/¯</div>
        <div>Couldn{"'"}t find what you were looking for</div>
        <Link href={"/"}>go home</Link>
      </div>
    </AppLayout>
  );
};

export default Custom404;
