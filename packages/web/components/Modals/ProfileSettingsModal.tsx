import { observer } from "mobx-react-lite";
import env from "../../environment";
import { objectKeys } from "../../helpers/arrays";
import { css } from "../../helpers/css";
import { ProfileDto } from "../../interfaces";
import Http from "../../services/http";
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
            onSubmit={async (values) => {
              const vals: ProfileDto = values as ProfileDto;
              const valuesToPost = { externalUrl: null, description: null };
              objectKeys(vals).forEach((key) => {
                if (values[key]) valuesToPost[key] = values[key];
              });
              return Http.postProfile(valuesToPost).then(({ data }) => {
                AppStore.events.publish(
                  AppStore.events.events.PROFILE_UPDATED,
                  data
                );
              });
            }}
            className={css("flex", "flex-col", "gap-2")}
          >
            <TextInput
              name={"description"}
              label={"Bio"}
              defaultValue={AppStore.auth.profile?.user.description}
              placeholder={"Tell me something about yourself..."}
              block
            />
            <TextInput
              name={"externalUrl"}
              label={"Website"}
              placeholder={"https://..."}
              defaultValue={AppStore.auth.profile?.user.externalUrl}
              block
            />
            <Submit block>Update</Submit>
          </Form>
        </div>
        <div>
          <div className={css("flex", "flex-col")}>
            <Text>Twitter</Text>
            <div className={css("mt-1", "w-full")}>
              <a href={`${env.api.baseUrl}/twitter/login`}>
                <Button block>Connect</Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
});

export default ProfileSettingsModal;
