import React, { PropsWithChildren } from "react";
import { css } from "../../helpers/css";
import AsyncWrap, { AsyncWrapProps } from "../AsyncWrap/AsyncWrap";

interface AsyncListWrapProps extends Omit<AsyncWrapProps, "renderLoading"> {
  quantity?: number;
  renderRow?: () => React.ReactNode;
  className?: string;
  layout?: "col" | "row";
}

const AsyncListWrap: React.FC<PropsWithChildren<AsyncListWrapProps>> = ({
  quantity = 5,
  layout = "col",
  ...props
}) => {
  const renderRow = () => {
    return (
      <div>
        <div
          className={css("bg-slate-300", "w-full")}
          style={{ height: props.height ? props.height : 25 }}
        />
      </div>
    );
  };

  return (
    <AsyncWrap
      {...props}
      renderLoading={() => {
        return (
          <div
            className={css("flex", "gap-4", "animate-pulse", props.className, {
              "flex-col": layout === "col",
              "justify-center": layout === "row",
            })}
          >
            {new Array(quantity).fill(null).map((item, index) => {
              return (
                <div key={`async-list-wrap-${index}-${layout}-${quantity}`}>
                  {props.renderRow ? props.renderRow() : renderRow()}
                </div>
              );
            })}
          </div>
        );
      }}
    />
  );
};

export default AsyncListWrap;
