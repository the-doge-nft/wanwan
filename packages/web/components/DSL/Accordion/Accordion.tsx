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

const Accordion = ({ children, ...rest }: AccordionProps) => {
  const [openValues, setOpenValues] = React.useState<string[]>([]);
  return (
    <AccordionContext.Provider value={openValues}>
      <RadixAccordion.Root
        value={openValues}
        onValueChange={(value) => {
          setOpenValues(value);
        }}
        type={"multiple"}
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
    <RadixAccordion.Item value={value} className={css("border-neutral-800")}>
      <RadixAccordion.Header className={css("p-2")}>
        <RadixAccordion.Trigger className={css("w-full")}>
          <div className={css("flex", "items-center", "justify-between")}>
            <div>{trigger}</div>
            <Text>{isOpen ? <BsChevronUp /> : <BsChevronDown />}</Text>
          </div>
        </RadixAccordion.Trigger>
      </RadixAccordion.Header>
      <RadixAccordion.Content className={css("px-2", "pb-4")}>
        {children}
      </RadixAccordion.Content>
    </RadixAccordion.Item>
  );
};

Accordion.Item = Item;

export default Accordion;
