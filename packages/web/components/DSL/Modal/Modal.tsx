import * as RadixDialog from "@radix-ui/react-dialog";
import React, { PropsWithChildren } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { css } from "../../../helpers/css";

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
          className={css("fixed", "bg-black", "inset-0", "opacity-30", "z-20")}
        />
        <RadixDialog.Content
          style={{ transform: "translate(-50%, -50%)", maxWidth: "450px" }}
          className={css(
            "bg-white",
            "rounded-sm",
            "top-1/2",
            "left-1/2",
            "fixed",
            "w-full",
            "md:w-9/12",
            "p-10",
            "text-black",
            "z-20",
            "outline-none",
            "drop-shadow-lg"
          )}
        >
          {onChange && (
            <RadixDialog.Close
              style={{ right: "5px", top: "5px" }}
              className={css("absolute", "text-black")}
            >
              <IoCloseOutline size={24} />
            </RadixDialog.Close>
          )}
          <div className={css("mb-2")}>
            <RadixDialog.Title
              className={css(
                "text-black",
                "text-2xl",
                "font-bold",
                "text-left",
                "mb-3"
              )}
            >
              {title}
            </RadixDialog.Title>
            <RadixDialog.Description>{description}</RadixDialog.Description>
          </div>
          {children}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};

export default Modal;
