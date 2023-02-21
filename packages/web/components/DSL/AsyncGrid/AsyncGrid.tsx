import { PropsWithChildren, useCallback } from "react";
import { css } from "../../../helpers/css";
import AsyncWrap, { AsyncWrapProps, NoDataFound } from "../AsyncWrap/AsyncWrap";

interface AsyncGridProps extends Pick<AsyncWrapProps, "isLoading"> {
  data: object[];
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
      className={css("grid", "grid-rows-[min-content]", "gap-4")}
      style={
        data.length > 0
          ? {
              gridTemplateColumns: "repeat(4, minmax(150px, 1fr))",
            }
          : {}
      }
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
