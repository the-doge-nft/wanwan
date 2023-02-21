import { IoCloseOutline } from "react-icons/io5";
import { cssTransition, toast } from "react-toastify";
import { isDev } from "../../../environment/vars";
import { css } from "../../../helpers/css";
import { bgColorCss, borderColorCss } from "../Theme";

export const toastTransition = cssTransition({
  enter: "animate__animated fadeIn",
  exit: "animate__animated fadeOut",
});

const toastBaseStyles = css(
  "!rounded-none",
  "text-sm",
  "border-[1px]",
  "border-black"
);

const CloseButton: React.FC<{ className?: string }> = ({
  className = "text-white",
}) => (
  <div className={css(className)}>
    <IoCloseOutline size={20} />
  </div>
);

export const successToast = (message: string) => {
  toast(message, {
    type: "success",
    className: css(
      toastBaseStyles,
      bgColorCss,
      borderColorCss,
      "text-black",
      "dark:text-white"
    ),
    icon: false,
    closeButton: (
      <CloseButton className={css("text-black", "dark:text-white")} />
    ),
  });
};

export const errorToast = (message: string) => {
  toast(message, {
    type: "error",
    className: css(toastBaseStyles, "!bg-red-800", "text-white"),
    icon: false,
    closeButton: <CloseButton />,
  });
};

export const warningToast = (message: string) => {
  toast(message, {
    type: "info",
    className: css(toastBaseStyles, "!bg-yellow-600", "text-white"),
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
          "border-[1px]",
          "border-dashed",
          "border-yellow-700",
          "text-white"
        ),
        icon: false,
        closeButton: <CloseButton />,
      }
    );
  }
};
