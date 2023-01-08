import DSLPage from "../components/DSL/DSL.page";
import { css } from "../helpers/css";
import AppLayout from "../layouts/App.layout";

const Components = () => {
  return (
    <AppLayout>
      <div className={css("flex", "flex-col", "gap-5")}>
        <DSLPage />
      </div>
    </AppLayout>
  );
};

export default Components;
