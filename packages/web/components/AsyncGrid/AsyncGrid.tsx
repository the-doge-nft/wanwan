import { PropsWithChildren } from "react";
import { css } from "../../helpers/css";
import AsyncWrap, {
  AsyncWrapProps,
  NoDataFound,
} from "../DSL/AsyncWrap/AsyncWrap";

interface AsyncGridProps extends Pick<AsyncWrapProps, "isLoading"> {
  data: object[];
}

const AsyncGrid: React.FC<PropsWithChildren<AsyncGridProps>> = ({
  isLoading,
  children,
  data,
}) => {
  return (
    <div
      className={css("grid", "grid-rows-[min-content]", "gap-4")}
      style={{
        gridTemplateColumns: "repeat(4, minmax(150px, 1fr))",
      }}
    >
      <AsyncWrap
        isLoading={isLoading}
        hasData={data.length > 0}
        renderNoData={() => <NoDataFound>competitions</NoDataFound>}
      >
        {children}
      </AsyncWrap>
    </div>
  );
};

export default AsyncGrid;
