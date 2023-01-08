import { css } from "../../../helpers/css";
import { Demo } from "../Demo";
import Pane, { PaneType } from "../Pane/Pane";
import { Variant } from "../Variant";

const PaneDemo = () => {
  return (
    <Demo title={"Pane"}>
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
    </Demo>
  );
};

export default PaneDemo;
