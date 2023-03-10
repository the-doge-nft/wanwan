import { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";
import { bgColorCss } from "../components/DSL/Theme";
import { css } from "../helpers/css";

export default function Document() {
  return (
    <Html>
      <Head title={"wanwan"}>
        <Script src="/theme.js" strategy={"beforeInteractive"} />
      </Head>
      <body className={css("font-ComicNeue", "mr-0", "!mr-0", bgColorCss)}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
