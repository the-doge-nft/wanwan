import { css } from "../../../helpers/css";
import { capitalizeFirstLetter } from "../../../helpers/strings";
import { Demo } from "../Demo";
import Pane, { PaneType } from "../Pane/Pane";
import Text, { TextType } from "../Text/Text";
import { Variant } from "../Variant";

const PaneDemo = () => {
  return (
    <Demo title={"Pane"}>
      <div className={css("flex", "flex-col", "gap-2")}>
        {Object.values(PaneType).map((type) => (
          <Variant title={type} key={type}>
            <Pane type={type} title={capitalizeFirstLetter(type)}>
              <div className={css("text-center")}>
                <Text type={TextType.Grey}>
                  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                </Text>
              </div>
            </Pane>
          </Variant>
        ))}
      </div>
    </Demo>
  );
};

export default PaneDemo;
