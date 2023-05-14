import { observer } from "mobx-react-lite";
import Head from "next/head";
import Router from "next/router";
import { useMemo } from "react";
import CreateMeme from "../components/CreateMeme/CreateMeme";
import env from "../environment";
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
    <>
      <Head>
        <title>Create memes - {env.app.name}</title>
      </Head>
      <AppLayout>
        <div
          className={css("h-full", "flex", "justify-center", "items-center")}
        >
          <div className={css("w-full")}>
            <CreateMeme store={store} />
          </div>
        </div>
      </AppLayout>
    </>
  );
});

export default CreateMemePage;
