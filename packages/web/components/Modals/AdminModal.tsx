import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import { FaTwitter } from "react-icons/fa";
import { css } from "../../helpers/css";
import AdminModalStore from "../../store/AdminModal.store";
import AppStore from "../../store/App.store";
import AspectRatio from "../DSL/AspectRatio/AspectRatio";
import Button from "../DSL/Button/Button";
import Modal from "../DSL/Modal/Modal";
import Text, { TextSize, TextType } from "../DSL/Text/Text";
import PreviewLink from "../PreviewLink/PreviewLink";

const AdminModal = observer(() => {
  const store = useMemo(() => new AdminModalStore(), []);
  return (
    <Modal
      title={"wow you are important"}
      isOpen={AppStore.modals.isAdminModalOpen}
      onChange={(isOpen) => (AppStore.modals.isAdminModalOpen = isOpen)}
    >
      <div className={css("grid", "grid-cols-2", "gap-2")}>
        {!store.meme && (
          <div className={css("relative")}>
            <AspectRatio
              ratio={"2/1"}
              className={css(
                "border-[1px]",
                "border-dashed",
                "border-neutral-400"
              )}
            />
            <div
              className={css(
                "absolute",
                "inset-0",
                "flex",
                "items-center",
                "justify-center"
              )}
            >
              <Text size={TextSize.xs} type={TextType.Grey}>
                {store.isLoading ? "...tweeting..." : <FaTwitter size={14} />}
              </Text>
            </div>
          </div>
        )}
        {store.meme && store.tweet && (
          <PreviewLink isExternal href={store.tweet.data.text}>
            <AspectRatio
              className={css("bg-cover", "bg-center", "bg-no-repeat", "h-full")}
              ratio={`${store.meme.media.width}/${store.meme.media.height}`}
              style={{ backgroundImage: `url(${store.meme.media.url})` }}
            />
          </PreviewLink>
        )}
        <div className={css("flex", "justify-center", "items-center")}>
          <Button isLoading={store.isLoading} onClick={() => store.postTweet()}>
            {store.buttonText}
          </Button>
        </div>
      </div>
    </Modal>
  );
});

export default AdminModal;
