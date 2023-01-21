import React, { PropsWithChildren, ReactNode } from "react";
import { css } from "../../../helpers/css";
import Spinner from "../Spinner/Spinner";

export const NoDataFound: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className={css("text-xs", "py-8", "text-center", "text-slate-500")}>
      {children}
    </div>
  );
};

export interface AsyncWrapProps {
  isLoading: boolean;
  hasData: boolean;
  height?: number;
  renderLoading?: () => React.ReactNode;
  renderNoData?: () => ReactNode;
}

const AsyncWrap: React.FC<PropsWithChildren<AsyncWrapProps>> = ({
  children,
  height = 200,
  isLoading,
  hasData,
  ...rest
}) => {
  const renderMessage = (message: string | JSX.Element) => {
    return (
      <div
        className={css(
          "w-full",
          "flex",
          "justify-center",
          "text-neutral-400",
          "items-center",
          "h-full",
          "flex-grow"
        )}
      >
        {message}
      </div>
    );
  };

  const renderLoading = () => {
    if (rest.renderLoading) {
      return rest.renderLoading();
    }
    return renderMessage(
      <div>
        <Spinner />
      </div>
    );
  };

  const renderNoData = () => {
    if (rest.renderNoData) {
      return rest.renderNoData();
    }
    return renderMessage(<div className={css("text-xs")}>no items found</div>);
  };

  return (
    <>
      {(() => {
        if (isLoading) {
          return renderLoading();
        } else if (!hasData) {
          return renderNoData();
        } else return children;
      })()}
    </>
  );
};

export default AsyncWrap;
