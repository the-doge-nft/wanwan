import { PropsWithChildren } from "react";
import { isDev } from "../../environment/vars";

const Dev: React.FC<PropsWithChildren> = ({ children }) => {
  if (isDev()) {
    return <>{children}</>;
  }
  return <></>;
};

export default Dev;
