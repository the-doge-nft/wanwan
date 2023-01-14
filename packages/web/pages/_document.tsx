import { Head, Html, Main, NextScript } from "next/document";
import { css } from "../helpers/css";

export default function Document() {
  return (
    <Html>
      <Head title={"Meme2Earn"} />
      <body
        className={css(
          "font-ComicNeue",
          "mr-0",
          "!mr-0",
          // defaultBgCss,
          "bg-gradient-to-b from-slate-200 to-white"
        )}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
