import * as RadixDropdown from "@radix-ui/react-dropdown-menu";
import { PropsWithChildren } from "react";
import { css } from "../../helpers/css";

interface DropdownProps {
  trigger: JSX.Element;
  children: JSX.Element | JSX.Element[];
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
    "bg-pixels-yellow-100",
    "text-black",
    "border-black"
  ),
  [DropdownType.White]: css("bg-black", "text-white", "border-blue-700"),
};

const Dropdown = ({
  trigger,
  children,
  open,
  onOpenChange,
  type = DropdownType.Primary,
}: DropdownProps) => {
  return (
    <RadixDropdown.Root open={open} onOpenChange={onOpenChange}>
      <RadixDropdown.Trigger asChild>
        <div className={css("inline-block")}>{trigger}</div>
      </RadixDropdown.Trigger>
      <RadixDropdown.Content
        style={{ minWidth: "200px", boxShadow: "0px 0px 10px rgba(0,0,0,0.1)" }}
        className={css(
          styleToTypeMap[type],
          "w-full",
          "mt-3",
          "px-2",
          "py-1",
          "border-[1px]",
          "rounded-sm",
          "bg-gray-200",
          "text-sm"
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

const Item: React.FC<PropsWithChildren<ItemProps>> = ({
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

Dropdown.Item = Item;
export default Dropdown;
