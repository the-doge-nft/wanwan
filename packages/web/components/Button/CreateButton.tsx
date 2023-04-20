import Link from "next/link";
import { AiOutlinePlus } from "react-icons/ai";
import { css } from "../../helpers/css";
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
          <Link href={"/create-meme"}>
            <Button
              // onClick={() => (AppStore.modals.isCreateMemeModalOpen = true)}
              block
            >
              <div className={css("flex", "items-center", "gap-0.5")}>
                <AiOutlinePlus size={15} />
                Meme
              </div>
            </Button>
          </Link>
        </DropdownItem>
        <DropdownItem className={css("mt-2")}>
          <Link href={"/create-competition"}>
            <Button
              // onClick={() =>
              //   (AppStore.modals.isCreateCompetitionModalOpen = true)
              // }
              block
            >
              <div className={css("flex", "items-center", "gap-0.5")}>
                <AiOutlinePlus size={15} />
                Competition
              </div>
            </Button>
          </Link>
        </DropdownItem>
      </div>
    </Dropdown>
  );
};

export default CreateButton;
