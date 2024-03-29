import * as RadixDialog from "@radix-ui/react-dialog";
import React, { PropsWithChildren } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { css } from "../../../helpers/css";
import Text, { TextType } from "../Text/Text";
import { bgColorCss } from "../Theme";

export interface ModalProps {
  isOpen?: boolean;
  title?: string;
  description?: string;
  onChange?: (value: boolean) => void;
}

const Modal: React.FC<PropsWithChildren<ModalProps>> = ({
  children,
  isOpen,
  title,
  description,
  onChange,
}) => {
  return (
    <RadixDialog.Root
      open={isOpen}
      onOpenChange={(value: any) => onChange && onChange(value)}
    >
      <RadixDialog.Portal>
        <RadixDialog.Overlay
          className={css(
            "fixed",
            "bg-black",
            "inset-0",
            "opacity-30",
            "z-20",
            "overflow-y-auto"
          )}
        />
        <RadixDialog.Content
          style={{ transform: "translate(-50%, -50%)", maxWidth: "420px" }}
          className={css(
            bgColorCss,
            "rounded-none",
            "top-1/2",
            "left-1/2",
            "fixed",
            "w-full",
            "md:w-9/12",
            "text-black",
            "z-20",
            "outline-none",
            "max-h-[95%]",
            "flex",
            "flex-col",
            "border-[1px]",
            "border-red-800"
          )}
        >
          {onChange && (
            <RadixDialog.Close
              style={{ right: "5px", top: "4px" }}
              className={css(
                "absolute",
                "text-white",
                "border-[1px]",
                "border-white",
                "outline-none"
              )}
            >
              <IoCloseOutline size={18} />
            </RadixDialog.Close>
          )}
          <div className={css()}>
            <RadixDialog.Title
              className={css("text-left", "bg-red-800", "p-1", "flex")}
            >
              <Text bold type={TextType.White}>
                {title}
              </Text>
            </RadixDialog.Title>
            <RadixDialog.Description>{description}</RadixDialog.Description>
          </div>
          <div className={css("p-5", "grow", "overflow-y-auto")}>
            {children}
          </div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};

export default Modal;
