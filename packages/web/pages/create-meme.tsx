import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import CreateMeme from "../components/CreateMeme/CreateMeme";
import { css } from "../helpers/css";
import AppLayout from "../layouts/App.layout";
import CreateMemeStore from "../store/CreateMeme.store";

const CreateMemePage = observer(() => {
  const store = useMemo(() => new CreateMemeStore(), []);
  return (
    <AppLayout>
      <div className={css("h-full", "flex", "justify-center", "items-center")}>
        <div className={css("w-full")}>
          <CreateMeme store={store} />
        </div>
      </div>
    </AppLayout>
  );
});

export default CreateMemePage;
