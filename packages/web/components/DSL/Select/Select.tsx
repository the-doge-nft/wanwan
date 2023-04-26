import * as RadixSelect from "@radix-ui/react-select";
import { BsChevronDown } from "react-icons/bs";
import { css } from "../../../helpers/css";
import { textFieldBaseStyles } from "../Input/Input";
import { bgColorCss, borderColorCss } from "../Theme";

export type SelectItem = { name: string; id: string };

export interface SelectProps {
  items: SelectItem[];
  value?: string;
  onChange: (value: string) => void;
  defaultValue?: string;
  block?: boolean;
  className?: string;
}

const Select = ({
  items,
  value,
  onChange,
  defaultValue,
  block = false,
  className,
}: SelectProps) => {
  return (
    <RadixSelect.Root
      onValueChange={(value) => onChange(value)}
      value={value}
      defaultValue={
        defaultValue ? defaultValue : items?.[0].id ? items[0].id : ""
      }
    >
      <RadixSelect.Trigger
        className={css(
          textFieldBaseStyles,
          "inline-flex",
          "items-center",
          "justify-between",
          {
            "w-full": block,
          },
          className
        )}
      >
        <RadixSelect.Value />
        <RadixSelect.Icon className={css("ml-2")}>
          <BsChevronDown />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        <RadixSelect.Content
          className={css(
            "overflow-hidden",
            "text-black",
            "dark:text-white",
            "text-sm",
            "border-[1px]",
            "z-20",
            bgColorCss,
            borderColorCss
          )}
        >
          <RadixSelect.Viewport className={css("p-2")}>
            <RadixSelect.Group>
              {items.map((item) => (
                <RadixSelect.Item
                  key={`select-${item.id}`}
                  value={item.id}
                  className={css(
                    "relative",
                    "cursor-pointer",
                    "hover-hover:hover:underline"
                  )}
                >
                  <RadixSelect.ItemText>{item.name}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator />
                </RadixSelect.Item>
              ))}
            </RadixSelect.Group>

            <RadixSelect.Separator />
          </RadixSelect.Viewport>
          <RadixSelect.ScrollDownButton />
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
};

export default Select;
