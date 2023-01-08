import Button from "../Button/Button";
import { Demo } from "../Demo";
import Dropdown from "./Dropdown";

const DropdownDemo = () => {
  return (
    <Demo title={"Dropdown"}>
      <Dropdown trigger={<Button>Dropdown</Button>}>
        <Dropdown.Item>1: Memes</Dropdown.Item>
        <Dropdown.Item>2: Competitions</Dropdown.Item>
        <Dropdown.Item>3: Rewards</Dropdown.Item>
      </Dropdown>
    </Demo>
  );
};

export default DropdownDemo;
