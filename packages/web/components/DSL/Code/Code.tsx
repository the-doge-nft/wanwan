import { PropsWithChildren } from "react";
import { css } from "../../../helpers/css";

const Code: React.FC<PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => {
  return (
    <code
      className={css(
        "text-code",
        "break-words",
        "overflow-auto",
        "break-all",
        "inline-block",
        "text-gray-700",
        "dark:text-gray-200",
        className
      )}
    >
      {children}
    </code>
  );
};

export default Code;
