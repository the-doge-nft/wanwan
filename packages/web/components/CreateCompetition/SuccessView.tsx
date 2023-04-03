import { observer } from "mobx-react-lite";
import { css } from "../../helpers/css";
import Text, { TextSize } from "../DSL/Text/Text";
import { CompetitionStoreProp } from "./CreateCompetition";
const SuccessView = observer(({ store }: CompetitionStoreProp) => {
  return (
    <div>
      <div
        className={css(
          "text-center",
          "flex",
          "items-center",
          "gap-2",
          "justify-center"
        )}
      >
        <Text>~~~</Text>
        <Text size={TextSize.lg}>Competition Created</Text>
        <Text>~~~</Text>
      </div>
    </div>
  );
});
export default SuccessView;
