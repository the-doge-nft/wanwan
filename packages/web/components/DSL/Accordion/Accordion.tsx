import * as RadixAccordion from "@radix-ui/react-accordion";

import React, { PropsWithChildren, ReactNode } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { css } from "../../../helpers/css";
import Text from "../Text/Text";

interface AccordionProps
  extends Partial<RadixAccordion.AccordionMultipleProps> {
  children: React.ReactNode;
}

const AccordionContext = React.createContext<string[]>([]);

const Accordion = ({
  children,
  type = "multiple",
  ...rest
}: AccordionProps) => {
  const [openValues, setOpenValues] = React.useState<string[]>([]);
  return (
    <AccordionContext.Provider value={openValues}>
      <RadixAccordion.Root
        value={openValues}
        onValueChange={(value) => {
          setOpenValues(value);
        }}
        type={type}
        {...rest}
      >
        {children}
      </RadixAccordion.Root>
    </AccordionContext.Provider>
  );
};

interface ItemProps extends RadixAccordion.AccordionItemProps {
  trigger: ReactNode;
}

const Item: React.FC<PropsWithChildren<ItemProps>> = ({
  value,
  children,
  trigger,
}) => {
  const context = React.useContext(AccordionContext);
  const isOpen = context.includes(value);
  return (
    <RadixAccordion.Item value={value} className={css()}>
      <RadixAccordion.Header
        className={css(
          "p-1",
          "hover:dark:border-neutral-700",
          "hover:border-black",
          "border-[1px]",
          "border-transparent",
          "rounded-sm"
        )}
      >
        <RadixAccordion.Trigger className={css("w-full")}>
          <div className={css("flex", "items-center", "justify-between")}>
            <div>{trigger}</div>
            <Text>{isOpen ? <BsChevronUp /> : <BsChevronDown />}</Text>
          </div>
        </RadixAccordion.Trigger>
      </RadixAccordion.Header>
      <RadixAccordion.Content className={css("p-1", "mt-2")}>
        {children}
      </RadixAccordion.Content>
    </RadixAccordion.Item>
  );
};

Accordion.Item = Item;

export default Accordion;
