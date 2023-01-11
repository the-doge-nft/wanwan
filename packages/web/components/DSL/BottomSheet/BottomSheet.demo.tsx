import { useRef, useState } from "react";
import { BottomSheetRef } from "react-spring-bottom-sheet";
import Button from "../Button/Button";
import { Demo } from "../Demo";
import BottomSheet from "./BottomSheet";

const BottomSheetDemo = () => {
  const [open, setOpen] = useState(false);
  const sheetRef = useRef<BottomSheetRef>(null);
  return (
    <Demo title={"Bottom Sheet"}>
      <div>
        <Button
          onClick={() => {
            setOpen(!open);
            sheetRef?.current?.snapTo(
              ({ maxHeight }: { maxHeight: number }) => maxHeight
            );
          }}
        >
          Open
        </Button>
        <BottomSheet
          onDismiss={() => setOpen(false)}
          ref={sheetRef}
          open={open}
        >
          <div>CHECK IT OUT</div>
        </BottomSheet>
      </div>
    </Demo>
  );
};

export default BottomSheetDemo;
