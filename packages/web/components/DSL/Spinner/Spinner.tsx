import { Oval } from "react-loader-spinner";
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

const Spinner = ({ size = SpinnerSize.sm }: SpinnerProps) => {
  return (
    <Oval
      ariaLabel="loading-indicator"
      height={spinnerSizes[size]}
      width={spinnerSizes[size]}
      strokeWidth={5}
      color={colors.slate[600]}
      secondaryColor={colors.slate[400]}
    />
  );
};

export default Spinner;
