import { css } from "../../helpers/css";
import { SubComponent, Variant } from "../../pages/components";
import { successToast } from "../Toast/Toast";
import Button from "./Button";

const ButtonDemo = () => {
  return (
    <SubComponent title={"Button"}>
      <Variant title={"Primary"}>
        <Button onClick={() => successToast("😉 Nice click")}>Click me</Button>
        <div className={css("ml-2", "inline-block")}>
          <Button isLoading onClick={() => successToast("😉")}>
            loading
          </Button>
        </div>
      </Variant>
    </SubComponent>
  );
};

export default ButtonDemo;
