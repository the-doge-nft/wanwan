import { observer } from "mobx-react-lite";
import Router from "next/router";
import { useMemo } from "react";
import CreateMeme from "../components/CreateMeme/CreateMeme";
import { css } from "../helpers/css";
import AppLayout from "../layouts/App.layout";
import AppStore from "../store/App.store";
import CreateMemeStore from "../store/CreateMeme/CreateMeme.store";

const CreateMemePage = observer(() => {
  const store = useMemo(
    () =>
      new CreateMemeStore(() =>
        Router.push(`/profile/${AppStore.auth.address}/meme`)
      ),
    []
  );
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
