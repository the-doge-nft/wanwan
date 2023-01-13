import { IoCloseOutline } from "react-icons/io5";
import { cssTransition, toast } from "react-toastify";
import { isDev } from "../../../environment/vars";
import { css } from "../../../helpers/css";
import { defaultBgCss } from "../Theme";

export const toastTransition = cssTransition({
  enter: "animate__animated fadeIn",
  exit: "animate__animated fadeOut",
});

const toastBaseStyles = css(
  "!rounded-none",
  "text-sm",
  "!text-white",
  "border-[1px]",
  "border-black"
);

const CloseButton: React.FC<{ color?: "black" | "white" }> = ({
  color = "white",
}) => (
  <div className={css(`text-${color}`)}>
    <IoCloseOutline size={20} />
  </div>
);

export const successToast = (message: string) => {
  toast(message, {
    type: "success",
    className: css(toastBaseStyles, defaultBgCss, "!text-black"),
    icon: false,
    closeButton: <CloseButton color={"black"} />,
  });
};

export const errorToast = (message: string) => {
  toast(message, {
    type: "error",
    className: css(toastBaseStyles, "!bg-red-800"),
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