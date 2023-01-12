import React from "react";
import {
  BottomSheet as SpringBottomSheet,
  BottomSheetRef,
} from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";
import { Props as SpringBottomSheetProps } from "react-spring-bottom-sheet/dist/types";
import { css } from "../../../helpers/css";

interface BottomSheetProps extends SpringBottomSheetProps {}

const BottomSheet = React.forwardRef<BottomSheetRef, BottomSheetProps>(
  (
    {
      children,
      snapPoints = ({ minHeight, maxHeight }) => [
        minHeight,
        maxHeight / 1.1,
        maxHeight,
      ],
      defaultSnap = ({ maxHeight }) => maxHeight / 1.1,
      ...rest
    },
    ref
  ) => {
    return (
      <>
        <SpringBottomSheet
          snapPoints={snapPoints}
          defaultSnap={defaultSnap}
          ref={ref}
          {...rest}
        >
          <div className={css("p-8", "h-full")}>{children}</div>
        </SpringBottomSheet>
      </>
    );
  }
);
BottomSheet.displayName = "BottomSheet";

export default BottomSheet;
