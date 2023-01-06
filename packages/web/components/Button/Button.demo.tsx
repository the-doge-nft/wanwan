import { SubComponent, Variant } from "../../pages/components";
import Button from "./Button";

const ButtonDemo = () => {
  return (
    <SubComponent title={"Button"}>
      <Variant title={"Primary"}>
        <Button onClick={() => alert("Check it out")}>Click me</Button>
      </Variant>
    </SubComponent>
  );
};

export default ButtonDemo;
