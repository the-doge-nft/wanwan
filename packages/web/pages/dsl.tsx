import DSLPage from "../components/DSL/DSL.page";
import { css } from "../helpers/css";
import AppLayout from "../layouts/App.layout";

const DSL = () => {
  return (
    <AppLayout>
      <div className={css("flex", "flex-col", "gap-5")}>
        <DSLPage />
      </div>
    </AppLayout>
  );
};

export default DSL;
