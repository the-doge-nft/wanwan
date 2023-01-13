import { useState } from "react";
import Button from "../Button/Button";
import { Demo } from "../Demo";
import Select from "../Select/Select";
import Modal from "./Modal";

const ModalDemo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState();
  return (
    <Demo title={"Modal"}>
      <Button onClick={() => setIsOpen(true)}>Open</Button>
      <Modal title={"We love memes!"} isOpen={isOpen} onChange={setIsOpen}>
        <div>check them out here yo</div>
        <Select
          defaultValue="test"
          onChange={(val) => setValue(val)}
          value={value}
          items={[
            { id: "test", name: "test" },
            { name: "empty", id: "empty" },
          ]}
        />
      </Modal>
    </Demo>
  );
};

export default ModalDemo;
