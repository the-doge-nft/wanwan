import { observer } from "mobx-react-lite";
import { Oval } from "react-loader-spinner";
import AppStore from "../../../store/App.store";
import { colors } from "../Theme";

export enum SpinnerSize {
  sm = "sm",
  lg = "lg",
}

interface SpinnerProps {
  size?: SpinnerSize;
}

const spinnerSizes = {
  [SpinnerSize.sm]: 20,
  [SpinnerSize.lg]: 26,
};

const Spinner = observer(({ size = SpinnerSize.sm }: SpinnerProps) => {
  // @next -- color mode should be independent of AppStore
  const isDarkMode = AppStore.settings.colorMode === "dark";
  return (
    <Oval
      ariaLabel="loading-indicator"
      height={spinnerSizes[size]}
      width={spinnerSizes[size]}
      strokeWidth={5}
      color={isDarkMode ? colors.neutral[500] : colors.neutral[700]}
      secondaryColor={isDarkMode ? colors.neutral[700] : colors.neutral[500]}
    />
  );
});

export default Spinner;
