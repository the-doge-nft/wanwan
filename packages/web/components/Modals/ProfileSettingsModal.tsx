import { observer } from "mobx-react-lite";
import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import env from "../../environment";
import { objectKeys } from "../../helpers/arrays";
import { css } from "../../helpers/css";
import { ProfileDto } from "../../interfaces";
import Http from "../../services/http";
import AppStore from "../../store/App.store";
import Button, { Submit } from "../DSL/Button/Button";
import Form from "../DSL/Form/Form";
import TextInput from "../DSL/Form/TextInput";
import { websiteUrl } from "../DSL/Form/validation";
import Link, { LinkType } from "../DSL/Link/Link";
import Modal, { ModalProps } from "../DSL/Modal/Modal";
import Text, { TextSize, TextType } from "../DSL/Text/Text";

interface SettingsModalProps extends ModalProps {}

const ProfileSettingsModal = observer(({}: SettingsModalProps) => {
  const [isDeleteTwitterLoading, setIsDeleteTwitterLoading] = useState(false);
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
            onSubmit={(values) => {
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
              defaultValue={AppStore.auth.profile?.user.description || ""}
              placeholder={"Tell me something about yourself..."}
              block
            />
            <TextInput
              name={"externalUrl"}
              label={"Website"}
              placeholder={"https://..."}
              defaultValue={AppStore.auth.profile?.user.externalUrl || ""}
              validate={websiteUrl}
              block
            />
            <Submit block>Update</Submit>
          </Form>
        </div>
        <div>
          <div className={css("mb-0.5")}>
            <Text size={TextSize.sm}>Twitter</Text>
          </div>
          {AppStore.auth.profile?.user?.twitterUsername && (
            <div
              className={css(
                "flex",
                "justify-between",
                "items-center",
                "border-[1px]",
                "border-black",
                "dark:border-neutral-600",
                "py-1",
                "px-2"
              )}
            >
              <Link
                type={LinkType.Secondary}
                isExternal
                href={`https://twitter.com/${AppStore.auth.profile?.user?.twitterUsername}`}
              >
                <Text type={TextType.NoColor}>
                  {AppStore.auth.profile?.user?.twitterUsername}
                </Text>
              </Link>
              <Button
                isLoading={isDeleteTwitterLoading}
                onClick={() => {
                  setIsDeleteTwitterLoading(true);
                  Http.deleteTwitterUsername()
                    .then(({ data }) => (AppStore.auth.profile = data))
                    .finally(() => setIsDeleteTwitterLoading(false));
                }}
              >
                <IoCloseOutline />
              </Button>
            </div>
          )}
          {!AppStore.auth.profile?.user?.twitterUsername && (
            <div className={css("w-full")}>
              <a href={`${env.api.baseUrl}/twitter/login`}>
                <Button block>Connect</Button>
              </a>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
});

export default ProfileSettingsModal;
