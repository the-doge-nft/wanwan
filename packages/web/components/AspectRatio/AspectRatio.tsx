import { PropsWithChildren } from "react";
import { css } from "../../helpers/css";

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
  style,
}) => {
  const computedStyle = {
    [CUSTOM_PROPERTY_NAME]: `(${ratio})`,
    ...style,
  } as React.CSSProperties;
  return (
    <>
      <style global jsx>{`
        [style*="--aspect-ratio"] > img {
          height: auto;
        }

        [style*="--aspect-ratio"] {
          position: relative;
        }

        [style*="--aspect-ratio"] > :first-child {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
        }

        [style*="--aspect-ratio"]::before {
          content: "";
          display: block;
          width: 100%;
        }

        @supports not (aspect-ratio: 1/1) {
          [style*="--aspect-ratio"]::before {
            height: 0;
            padding-bottom: calc(100% / (var(--aspect-ratio)));
          }
        }

        @supports (aspect-ratio: 1/1) {
          [style*="--aspect-ratio"]::before {
            aspect-ratio: calc(var(--aspect-ratio));
          }
        }
      `}</style>
      <div className={css(className)} style={computedStyle}>
        {children}
      </div>
    </>
  );
};

export default AspectRatio;
