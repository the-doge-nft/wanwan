import React, { PropsWithChildren, ReactNode } from "react";
import { css } from "../../../helpers/css";
import Spinner from "../Spinner/Spinner";
import Text, { TextSize, TextType } from "../Text/Text";

export const NoDataFound: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className={css("text-xs", "py-4", "text-center")}>
      <Text type={TextType.Grey} size={TextSize.sm}>
        {children}
      </Text>
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
