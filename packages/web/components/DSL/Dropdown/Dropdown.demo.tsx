import Button from "../Button/Button";
import { Demo } from "../Demo";
import Dropdown, { DropdownItem } from "./Dropdown";

const DropdownDemo = () => {
  return (
    <Demo title={"Dropdown"}>
      <Dropdown trigger={<Button>Dropdown</Button>}>
        <DropdownItem>1: Memes</DropdownItem>
        <DropdownItem>2: Competitions</DropdownItem>
        <DropdownItem>3: Rewards</DropdownItem>
      </Dropdown>
    </Demo>
  );
};

export default DropdownDemo;
