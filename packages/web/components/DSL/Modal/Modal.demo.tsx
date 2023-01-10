import { useState } from "react";
import Button from "../Button/Button";
import { Demo } from "../Demo";
import Modal from "./Modal";

const ModalDemo = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Demo title={"Modal"}>
      <Button onClick={() => setIsOpen(true)}>Open</Button>
      <Modal title={"We love memes!"} isOpen={isOpen} onChange={setIsOpen}>
        <div>check them out here yo</div>
      </Modal>
    </Demo>
  );
};

export default ModalDemo;
