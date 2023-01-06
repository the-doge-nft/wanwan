import { TfiClose } from "react-icons/tfi";
import { toast } from "react-toastify";
import { isDev } from "../../environment/vars";
import { css } from "../../helpers/css";

const toastBaseStyles = css("!rounded-none", "text-sm", "!text-white");

const CloseButton = () => (
  <div className={css("text-white")}>
    <TfiClose size={18} />
  </div>
);

export const successToast = (message: string) => {
  toast(message, {
    type: "success",
    className: css(toastBaseStyles, "!bg-green-600"),
    icon: false,
    closeButton: <CloseButton />,
  });
};

export const errorToast = (message: string) => {
  toast(message, {
    type: "error",
    className: css(toastBaseStyles, "!bg-red-600"),
    icon: false,
    closeButton: <CloseButton />,
  });
};

export const warningToast = (message: string) => {
  toast(message, {
    type: "info",
    className: css(toastBaseStyles, "!bg-yellow-600"),
    icon: false,
    closeButton: <CloseButton />,
  });
};

export const debugToast = (message: string) => {
  if (isDev()) {
    toast(
      <div>
        <div className={css("font-bold")}>🛠 DEV 🛠</div>
        <div>{message}</div>
      </div>,
      {
        type: "warning",
        className: css(
          toastBaseStyles,
          "!bg-yellow-500",
          "border-2",
          "border-dashed",
          "border-yellow-700"
        ),
        icon: false,
        closeButton: <CloseButton />,
      }
    );
  }
};
