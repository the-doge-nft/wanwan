import { SubComponent } from "../../pages/components";
import Button from "../Button/Button";
import Dropdown from "./Dropdown";

const DropdownDemo = () => {
  return (
    <SubComponent title={"Dropdown"}>
      <Dropdown trigger={<Button>Dropdown</Button>}>
        <Dropdown.Item>1: Memes</Dropdown.Item>
        <Dropdown.Item>2: Competitions</Dropdown.Item>
        <Dropdown.Item>3: Rewards</Dropdown.Item>
      </Dropdown>
    </SubComponent>
  );
};

export default DropdownDemo;
