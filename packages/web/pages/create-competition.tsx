import { observer } from "mobx-react-lite";
import Head from "next/head";
import { useEffect, useMemo } from "react";
import CreateCompetition from "../components/CreateCompetition/CreateCompetition";
import { ConnectButton } from "../components/DSL/Button/Button";
import Text from "../components/DSL/Text/Text";
import env from "../environment";
import { css } from "../helpers/css";
import AppLayout from "../layouts/App.layout";
import AppStore from "../store/App.store";
import CreateCompetitionStore from "../store/CreateCompetition/CreateCompetition.store";

const CreateCompetitionPage = observer(() => {
  const store = useMemo(() => new CreateCompetitionStore(), []);
  useEffect(() => {
    if (AppStore.auth.isLoggedIn) {
      store.init();
    }
  }, [AppStore.auth.isLoggedIn, store]);
  return (
    <>
      <Head>
        <title>Create competition - {env.app.name}</title>
      </Head>
      <AppLayout>
        <div
          className={css("h-full", "flex", "justify-center", "items-center")}
        >
          <div className={css("max-w-xl", "w-full")}>
            {AppStore.auth.isLoggedIn && <CreateCompetition store={store} />}
            {!AppStore.auth.isLoggedIn && (
              <div className={css("text-center")}>
                <ConnectButton />
                <Text>to create a competition</Text>
              </div>
            )}
          </div>
        </div>
      </AppLayout>
    </>
  );
});

export default CreateCompetitionPage;
