import { css } from "../../helpers/css";
import { SubComponent, Variant } from "../../pages/components";
import Pane, { PaneType } from "./Pane";

const PaneDemo = () => {
  return (
    <SubComponent title={"Pane"}>
      <div className={css("flex", "flex-col", "gap-2")}>
        <Variant title={"Primary"}>
          <Pane title={"What is meme2earn?"}>😊😊😊</Pane>
        </Variant>
        <Variant title={"Secondary"}>
          <Pane type={PaneType.Secondary} title={"Competitions"}>
            🙁🙁🙁
          </Pane>
        </Variant>
      </div>
    </SubComponent>
  );
};

export default PaneDemo;
