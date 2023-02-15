import Link from "../components/DSL/Link/Link";
import Text from "../components/DSL/Text/Text";
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
        <Text>¯\_(ツ)_/¯</Text>
        <Text>Couldn{"'"}t find what you were looking for</Text>
        <Link href={"/"}>go home</Link>
      </div>
    </AppLayout>
  );
};

export default Custom404;
