import { observer } from "mobx-react-lite";
import { css } from "../../helpers/css";
import AppStore from "../../store/App.store";
import Button, { Submit } from "../DSL/Button/Button";
import Form from "../DSL/Form/Form";
import TextInput from "../DSL/Form/TextInput";
import Modal, { ModalProps } from "../DSL/Modal/Modal";
import Text from "../DSL/Text/Text";

interface SettingsModalProps extends ModalProps {}

const ProfileSettingsModal = observer(({}: SettingsModalProps) => {
  return (
    <Modal
      title={"Settings"}
      isOpen={AppStore.modals.isSettingsModalOpen}
      onChange={(isOpen) => (AppStore.modals.isSettingsModalOpen = isOpen)}
    >
      <div className={css("flex", "justify-center", "mb-8")}>
        <div className={css("flex", "flex-col", "items-center", "gap-1")}>
          <div
            className={css(
              "h-[85px]",
              "w-[85px]",
              "bg-center",
              "bg-no-repeat",
              "bg-contain",
              "border-[1px]",
              "border-black",
              "dark:border-neutral-600",
              "dark:bg-neutral-800",
              "rounded-full",
              { "bg-slate-200": !AppStore.auth.profile?.avatar }
            )}
            style={
              AppStore.auth.profile?.avatar
                ? {
                    backgroundImage: `url(${AppStore.auth.profile?.avatar})`,
                  }
                : {}
            }
          />
          <Text>{AppStore.auth.displayName}</Text>
        </div>
      </div>
      <div className={css("grid", "grid-cols-2", "gap-2")}>
        <div>
          <Form
            onSubmit={async () => {}}
            className={css("flex", "flex-col", "gap-2")}
          >
            <TextInput name={"description"} label={"Bio"} block />
            <TextInput
              name={"externalUrl"}
              label={"Website"}
              placeholder={"https://"}
              block
            />
            <Submit block>Update</Submit>
          </Form>
        </div>
        <div>
          <div className={css("flex", "flex-col")}>
            <Text>Twitter</Text>
            <Button>Connect</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
});

export default ProfileSettingsModal;
