import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import CreateCompetition from "../components/CreateCompetition/CreateCompetition";
import { css } from "../helpers/css";
import AppLayout from "../layouts/App.layout";
import CreateCompetitionStore from "../store/CreateCompetition/CreateCompetition.store";

const CreateCompetitionPage = observer(() => {
  const store = useMemo(() => new CreateCompetitionStore(), []);
  return (
    <AppLayout>
      <div className={css("h-full", "flex", "justify-center", "items-center")}>
        <div className={css("max-w-lg", "w-full")}>
          <CreateCompetition store={store} />
        </div>
      </div>
    </AppLayout>
  );
});

export default CreateCompetitionPage;
