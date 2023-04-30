import { PropsWithChildren, useCallback } from "react";
import { css } from "../../../helpers/css";
import AsyncWrap, { AsyncWrapProps, NoDataFound } from "../AsyncWrap/AsyncWrap";

interface AsyncGridProps extends Pick<AsyncWrapProps, "isLoading"> {
  data: any[];
  noDataLabel?: string;
}

const AsyncGrid: React.FC<PropsWithChildren<AsyncGridProps>> = ({
  isLoading,
  children,
  noDataLabel,
  data,
}) => {
  const renderNoData = useCallback(
    () => (
      <NoDataFound>{noDataLabel ? noDataLabel : "No data found"}</NoDataFound>
    ),
    [noDataLabel]
  );

  return (
    <div
      className={css({
        "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2": data.length > 0,
      })}
    >
      <AsyncWrap
        isLoading={isLoading}
        hasData={data.length > 0}
        renderNoData={renderNoData}
      >
        {children}
      </AsyncWrap>
    </div>
  );
};

export default AsyncGrid;
