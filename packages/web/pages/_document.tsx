import { Head, Html, Main, NextScript } from "next/document";
import { bgColorCss } from "../components/DSL/Theme";
import { css } from "../helpers/css";

export default function Document() {
  return (
    <Html>
      <Head title={"wanwan"} />
      <body className={css("font-ComicNeue", "mr-0", "!mr-0", bgColorCss)}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
