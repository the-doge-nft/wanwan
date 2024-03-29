import { observer } from "mobx-react-lite";
import Head from "next/head";
import { useMemo } from "react";
import Link from "../components/DSL/Link/Link";
import Pane, { PaneType } from "../components/DSL/Pane/Pane";
import Text from "../components/DSL/Text/Text";
import env from "../environment";
import { css } from "../helpers/css";
import AppLayout from "../layouts/App.layout";
import FaqPageStore, { FaqItem } from "../store/FaqPage.store";

const FAQPage = observer(() => {
  const store = useMemo(() => new FaqPageStore(), []);
  return (
    <>
      <Head>
        <title>FAQ - {env.app.name}</title>
      </Head>
      <AppLayout>
        <div className={css("grid", "grid-cols-1", "sm:grid-cols-2", "gap-2")}>
          <div className={css("hidden", "sm:block")}>
            <Pane type={PaneType.Green} title={"Questions"}>
              <ol
                className={css(
                  "flex",
                  "flex-col",
                  "gap-1",
                  "list-disc",
                  "pl-3",
                  "text-red-800"
                )}
              >
                {store.items.map((item, index) => (
                  <li key={`link-${item.id}-${index}}`}>
                    <Link className={css("!block")} href={`#${item.id}`}>
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ol>
            </Pane>
          </div>
          <Pane title={"FAQ"}>
            <div className={css("flex", "flex-col", "gap-4")}>
              {store.items.map((item, index) => (
                <Item key={`${item.title}-${index}`} {...item} />
              ))}
            </div>
          </Pane>
        </div>
      </AppLayout>
    </>
  );
});

const Item = observer(({ ...item }: FaqItem) => {
  return (
    <div id={item.id}>
      <Text bold>{item.title}</Text>
      <Text block>{item.content}</Text>
    </div>
  );
});

export default FAQPage;
