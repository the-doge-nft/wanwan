import { PropsWithChildren } from "react";
import { css } from "../../../helpers/css";
import { jsonify } from "../../../helpers/strings";

const CUSTOM_PROPERTY_NAME = "--aspect-ratio";

interface AspectRatioProps {
  className?: string;
  ratio: string | number;
  style?: React.CSSProperties;
}

const AspectRatio: React.FC<PropsWithChildren<AspectRatioProps>> = ({
  children,
  className,
  ratio = 1,
  style = {},
}) => {
  const computedStyle = {
    [CUSTOM_PROPERTY_NAME]: `(${ratio})`,
    ...style,
  } as React.CSSProperties;
  console.log(computedStyle);
  return (
    <>
      <div className={css(className)} style={computedStyle}>
        {children}
      </div>
      <div>{jsonify(computedStyle)}</div>
    </>
  );
};

export default AspectRatio;
