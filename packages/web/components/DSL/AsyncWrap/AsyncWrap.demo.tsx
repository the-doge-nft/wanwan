import { useState } from "react";
import { css } from "../../../helpers/css";
import Button from "../Button/Button";
import { Demo } from "../Demo";
import AsyncWrap from "./AsyncWrap";

const AsyncWrapDemo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasData, setHasData] = useState(false);
  return (
    <Demo title={"Async Wrap"}>
      <div className={css("grid", "grid-cols-3")}>
        <div className={css("col-span-2")}>
          <AsyncWrap isLoading={isLoading} hasData={hasData}>
            <div
              className={css(
                "flex",
                "flex-col",
                "text-center",
                "text-xs",
                "h-full",
                "justify-center"
              )}
            >
              <div>¯\_(ツ)_/¯</div>
            </div>
          </AsyncWrap>
        </div>
        <div className={css("grid", "gap-5", "col-span-1")}>
          <Button onClick={() => setIsLoading(!isLoading)}>
            toggle isLoading
          </Button>
          <Button onClick={() => setHasData(!hasData)}>toggle hasData</Button>
        </div>
      </div>
    </Demo>
  );
};

export default AsyncWrapDemo;
