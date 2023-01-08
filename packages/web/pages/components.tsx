import { PropsWithChildren } from "react";
import AccordionDemo from "../components/Accordion/Accordion.demo";
import AspectRatioDemo from "../components/AspectRatio/AspectRatio.demo";
import AsyncListWrapDemo from "../components/AsyncListWrap/AsyncListWrap.demo";
import AsyncWrapDemo from "../components/AsyncWrap/AsyncWrap.demo";
import ButtonDemo from "../components/Button/Button.demo";
import CodeDemo from "../components/Code/Code.demo";
import DropdownDemo from "../components/Dropdown/Dropdown.demo";
import FormDemo from "../components/Form/Form.demo";
import InfiniteScrollDemo from "../components/InfiniteScroll/InfiniteScroll.demo";
import InputDemo from "../components/Input/Input.demo";
import PaneDemo from "../components/Pane/Pane.demo";
import SpinnerDemo from "../components/Spinner/Spinner.demo";
import ToastDemo from "../components/Toast/Toast.demo";
import { css } from "../helpers/css";
import AppLayout from "../layouts/App.layout";

export const SubComponent: React.FC<PropsWithChildren<{ title?: string }>> = ({
  children,
  title,
}) => {
  return (
    <div className={css("border-[1px]", "border-black", "p-2", "bg-gray-100")}>
      {title && <div className={css("text-sm", "italic", "mb-1")}>{title}</div>}
      <div>{children}</div>
    </div>
  );
};

export const Variant: React.FC<
  PropsWithChildren<{ title: string; block?: boolean; className?: string }>
> = ({ title, children, block, className }) => {
  return (
    <div className={css({ "w-full": block }, className)}>
      <div className={css("text-xs", "text-gray-600", "mb-1")}>v: {title}</div>
      {children}
    </div>
  );
};

const Components = () => {
  return (
    <AppLayout>
      <div className={css("flex", "flex-col", "gap-5")}>
        <ButtonDemo />
        <PaneDemo />
        <DropdownDemo />
        <CodeDemo />
        <ToastDemo />
        <SpinnerDemo />
        <InputDemo />
        <FormDemo />
        <AsyncWrapDemo />
        <AsyncListWrapDemo />
        <AccordionDemo />
        <InfiniteScrollDemo />
        <AspectRatioDemo />
      </div>
    </AppLayout>
  );
};

export default Components;
