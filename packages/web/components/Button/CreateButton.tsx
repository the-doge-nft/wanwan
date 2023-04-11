import { AiOutlinePlus } from "react-icons/ai";
import { css } from "../../helpers/css";
import AppStore from "../../store/App.store";
import Button from "../DSL/Button/Button";
import Dropdown, { DropdownItem } from "../DSL/Dropdown/Dropdown";

export const CreateButton = () => {
  return (
    <Dropdown
      trigger={
        <Button>
          <div className={css("flex", "items-center", "gap-0.5")}>
            <AiOutlinePlus size={15} />
            Create
          </div>
        </Button>
      }
      align={"center"}
    >
      <div className={css("py-2")}>
        <DropdownItem>
          <Button
            onClick={() => (AppStore.modals.isCreateMemeModalOpen = true)}
            block
          >
            <div className={css("flex", "items-center", "gap-0.5")}>
              <AiOutlinePlus size={15} />
              Meme
            </div>
          </Button>
        </DropdownItem>
        <DropdownItem className={css("mt-2")}>
          <Button
            onClick={() =>
              (AppStore.modals.isCreateCompetitionModalOpen = true)
            }
            block
          >
            <div className={css("flex", "items-center", "gap-0.5")}>
              <AiOutlinePlus size={15} />
              Competition
            </div>
          </Button>
        </DropdownItem>
      </div>
    </Dropdown>
  );
};

export default CreateButton;
