import { IoCloseOutline } from "react-icons/io5";
import { cssTransition, toast } from "react-toastify";
import { isDev } from "../../environment/vars";
import { css } from "../../helpers/css";

const transition = cssTransition({
  enter: "flex",
  exit: "hidden",
});

const toastBaseStyles = css(
  "!rounded-none",
  "text-sm",
  "!text-white",
  "border-[1px]",
  "border-black"
);

const CloseButton = () => (
  <div className={css("text-black")}>
    <IoCloseOutline size={20} />
  </div>
);

export const successToast = (message: string) => {
  toast(message, {
    type: "success",
    className: css(toastBaseStyles, "!bg-slate-200", "!text-black"),
    icon: false,
    closeButton: <CloseButton />,
    transition,
  });
};

export const errorToast = (message: string) => {
  toast(message, {
    type: "error",
    className: css(toastBaseStyles, "!bg-red-800"),
    icon: false,
    closeButton: <CloseButton />,
    transition,
  });
};

export const warningToast = (message: string) => {
  toast(message, {
    type: "info",
    className: css(toastBaseStyles, "!bg-yellow-600"),
    icon: false,
    closeButton: <CloseButton />,
    transition,
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
        transition,
      }
    );
  }
};
