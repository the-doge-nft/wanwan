import AccordionDemo from "./Accordion/Accordion.demo";
import AspectRatioDemo from "./AspectRatio/AspectRatio.demo";
import AsyncListWrapDemo from "./AsyncListWrap/AsyncListWrap.demo";
import AsyncWrapDemo from "./AsyncWrap/AsyncWrap.demo";
import BottomSheetDemo from "./BottomSheet/BottomSheet.demo";
import ButtonDemo from "./Button/Button.demo";
import CodeDemo from "./Code/Code.demo";
import DropdownDemo from "./Dropdown/Dropdown.demo";
import FormDemo from "./Form/Form.demo";
import InfiniteScrollDemo from "./InfiniteScroll/InfiniteScroll.demo";
import InputDemo from "./Input/Input.demo";
import MarqueeDemo from "./Marquee/Marquee.demo";
import ModalDemo from "./Modal/Modal.demo";
import PaneDemo from "./Pane/Pane.demo";
import SelectDemo from "./Select/Select.demo";
import SpinnerDemo from "./Spinner/Spinner.demo";
import ToastDemo from "./Toast/Toast.demo";

const DSLPage = () => {
  return (
    <>
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
    </>
  );
};

export default DSLPage;
