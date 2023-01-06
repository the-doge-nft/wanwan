import { css } from "../../helpers/css";
import { SubComponent, Variant } from "../../pages/components";
import Button from "./Button";

const ButtonDemo = () => {
  return (
    <SubComponent title={"Button"}>
      <Variant title={"Primary"}>
        <Button onClick={() => alert("Check it out")}>Click me</Button>
        <div className={css("ml-2", "inline-block")}>
          <Button isLoading onClick={() => alert("should not fire")}>
            loading
          </Button>
        </div>
      </Variant>
    </SubComponent>
  );
};

export default ButtonDemo;
