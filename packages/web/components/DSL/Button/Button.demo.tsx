import { css } from "../../../helpers/css";
import { Demo } from "../Demo";
import { successToast } from "../Toast/Toast";
import { Variant } from "../Variant";
import Button from "./Button";

const ButtonDemo = () => {
  return (
    <Demo title={"Button"}>
      <Variant title={"Primary"}>
        <Button onClick={() => successToast("😉 Nice click")}>Click me</Button>
        <div className={css("ml-2", "inline-block")}>
          <Button isLoading onClick={() => successToast("😉")}>
            loading
          </Button>
        </div>
      </Variant>
    </Demo>
  );
};

export default ButtonDemo;
