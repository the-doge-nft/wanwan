import { observer } from "mobx-react-lite";
import { css } from "../../helpers/css";
import { Competition, Meme } from "../../interfaces";
import AspectRatio from "../DSL/AspectRatio/AspectRatio";
import Button from "../DSL/Button/Button";
import Modal from "../DSL/Modal/Modal";
import Text, { TextType } from "../DSL/Text/Text";

interface CurateModalProps {
  isOpen: boolean;
  onChange: (isOpen: boolean) => void;
  competition: Competition;
  meme: Meme;
  onConfirm: () => void;
}

const CurateModal = observer(({ onConfirm, competition, meme, ...rest }: CurateModalProps) => {
  return (
    <Modal title={"Curate"} {...rest}>
      <div className={css("text-center", "flex", "flex-col", "gap-2")}>
        <Text>Are you sure you want to remove this meme from the competition?</Text>
        <AspectRatio ratio={"1/1"} className={css("bg-cover", "bg-no-repeat", "bg-center")}                             style={{
                              backgroundImage: `url(${meme.media.url})`,
                            }}/>
  
  <div>
        <Text type={TextType.Grey}>this action is irreversable</Text>
  </div>
          <Button onClick={() => onConfirm()}>Hide this Meme</Button>
   
      </div>
    </Modal>
  );
})

export default CurateModal;
