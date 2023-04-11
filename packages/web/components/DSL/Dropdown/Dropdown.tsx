import * as RadixDropdown from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";
import { PropsWithChildren } from "react";
import { css } from "../../../helpers/css";
import { bgColorCss, borderColorCss } from "../Theme";

interface DropdownProps extends Pick<DropdownMenuContentProps, "align"> {
  trigger: JSX.Element;
  open?: boolean;
  onOpenChange?: (value: boolean) => void;
  type?: DropdownType;
}

export enum DropdownType {
  Primary = "primary",
  White = "white",
}

const styleToTypeMap = {
  [DropdownType.Primary]: css(
    bgColorCss,
    borderColorCss,
    "text-black",
    "dark:text-white"
  ),
  [DropdownType.White]: css("bg-black", "text-white", "border-blue-700"),
};

const Dropdown: React.FC<PropsWithChildren<DropdownProps>> = ({
  trigger,
  children,
  open,
  onOpenChange,
  type = DropdownType.Primary,
  align = "end",
}) => {
  return (
    <RadixDropdown.Root open={open} onOpenChange={onOpenChange}>
      <RadixDropdown.Trigger asChild>
        <div className={css("inline-block")}>{trigger}</div>
      </RadixDropdown.Trigger>
      <RadixDropdown.Content
        style={{ minWidth: "150px" }}
        collisionPadding={10}
        align={align}
        className={css(
          styleToTypeMap[type],
          "w-full",
          "mt-1",
          "px-2",
          "py-1",
          "border-[1px]",
          "rounded-sm",
          "text-sm",
          bgColorCss
        )}
      >
        {children}
      </RadixDropdown.Content>
    </RadixDropdown.Root>
  );
};

interface ItemProps {
  className?: string;
}

export const DropdownItem: React.FC<PropsWithChildren<ItemProps>> = ({
  children,
  className,
}) => {
  return (
    <RadixDropdown.Item
      className={css(className, "outline-0", "text-sm")}
      style={{ boxShadow: "none" }}
    >
      {children}
    </RadixDropdown.Item>
  );
};

export default Dropdown;
