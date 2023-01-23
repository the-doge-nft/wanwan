import { css } from "../../../helpers/css";
import { Demo } from "../Demo";
import { successToast } from "../Toast/Toast";
import { Variant } from "../Variant";
import Button, { ButtonSize } from "./Button";

const ButtonDemo = () => {
  return (
    <Demo title={"Button"}>
      <Variant title={"Primary (sm)"}>
        <div className={css("flex", "gap-2")}>
          <Button onClick={() => successToast("😉 Nice click")}>
            Click me
          </Button>
          <Button isLoading onClick={() => successToast("😉")}>
            loading
          </Button>
          <Button disabled>disabled</Button>
        </div>
      </Variant>
      <Variant title={"Primary (lg)"}>
        <div className={css("flex", "gap-2")}>
          <Button
            size={ButtonSize.lg}
            onClick={() => successToast("😉 Nice LARGE click")}
          >
            Click me
          </Button>
          <Button
            size={ButtonSize.lg}
            isLoading
            onClick={() => successToast("😉")}
          >
            loading
          </Button>
          <Button disabled size={ButtonSize.lg}>
            disabled
          </Button>
        </div>
      </Variant>
    </Demo>
  );
};

export default ButtonDemo;
