import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import Pane from "../components/DSL/Pane/Pane";
import Text, { TextSize } from "../components/DSL/Text/Text";
import { css } from "../helpers/css";
import AppLayout from "../layouts/App.layout";
import FaqPageStore, { FaqItem } from "../store/FaqPage.store";

const FAQPage = observer(() => {
  const store = useMemo(() => new FaqPageStore(), []);
  return (
    <AppLayout>
      <div className={css("text-center", "mb-2")}>
        <Text size={TextSize.xl} bold>
          FAQ
        </Text>
      </div>
      <div className={css("flex", "flex-col", "gap-2")}>
        {store.items.map((item, index) => (
          <Item key={`${item.title}-${index}`} {...item} />
        ))}
      </div>
    </AppLayout>
  );
});

const Item = observer(({ ...item }: FaqItem) => {
  return (
    <Pane title={item.title}>
      <Text>{item.content}</Text>
    </Pane>
  );
});

export default FAQPage;
