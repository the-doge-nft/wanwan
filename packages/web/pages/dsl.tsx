import AccordionDemo from "../components/DSL/Accordion/Accordion.demo";
import AspectRatioDemo from "../components/DSL/AspectRatio/AspectRatio.demo";
import AsyncListWrapDemo from "../components/DSL/AsyncListWrap/AsyncListWrap.demo";
import AsyncWrapDemo from "../components/DSL/AsyncWrap/AsyncWrap.demo";
import BottomSheetDemo from "../components/DSL/BottomSheet/BottomSheet.demo";
import ButtonDemo from "../components/DSL/Button/Button.demo";
import CodeDemo from "../components/DSL/Code/Code.demo";
import DropdownDemo from "../components/DSL/Dropdown/Dropdown.demo";
import FormDemo from "../components/DSL/Form/Form.demo";
import InfiniteScrollDemo from "../components/DSL/InfiniteScroll/InfiniteScroll.demo";
import InputDemo from "../components/DSL/Input/Input.demo";
import MarqueeDemo from "../components/DSL/Marquee/Marquee.demo";
import ModalDemo from "../components/DSL/Modal/Modal.demo";
import PaneDemo from "../components/DSL/Pane/Pane.demo";
import SelectDemo from "../components/DSL/Select/Select.demo";
import SpinnerDemo from "../components/DSL/Spinner/Spinner.demo";
import ToastDemo from "../components/DSL/Toast/Toast.demo";
import { css } from "../helpers/css";
import AppLayout from "../layouts/App.layout";

const DSL = () => {
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
        <ModalDemo />
        <MarqueeDemo />
        <BottomSheetDemo />
        <SelectDemo />
      </div>
    </AppLayout>
  );
};

export default DSL;
