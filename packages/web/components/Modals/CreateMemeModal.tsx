import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import { Meme } from "../../interfaces";
import CreateMemeStore from "../../store/CreateMeme/CreateMeme.store";
import CreateMeme from "../CreateMeme/CreateMeme";
import Modal from "../DSL/Modal/Modal";

interface CreateMemeModalProps {
  onSuccess?: (memes: Array<Meme>) => void;
  max?: number;
  isOpen: boolean;
  onChange: (isOpen: boolean) => void;
}

const CreateMemeModal = observer(
  ({ onSuccess, max, isOpen, onChange }: CreateMemeModalProps) => {
    const store = useMemo(() => new CreateMemeStore(onSuccess), [onSuccess]);
    return (
      <Modal
        title={store.title}
        isOpen={isOpen}
        onChange={(isOpen) => onChange(isOpen)}
      >
        <CreateMeme store={store} max={max} />
      </Modal>
    );
  }
);

export default CreateMemeModal;
