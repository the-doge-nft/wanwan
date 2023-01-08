import { useState } from "react";
import { css } from "../../../helpers/css";
import Button from "../Button/Button";
import { Demo } from "../Demo";
import { Variant } from "../Variant";
import InfiniteScroll from "./InfiniteScroll";

const InfiniteScrollDemo = () => {
  const [dataLength, setDataLength] = useState(10);
  const [fullScrollHeight, setFullScrollHeight] = useState(200);
  const [height, setHeight] = useState(500);
  const [fullPageHasMoreData, setFullPageHasMoreData] = useState(false);
  return (
    <Demo title={"Infinte Scroll Demo"}>
      <Variant title={"Scroll By Container"}>
        <InfiniteScroll
          dataLength={dataLength}
          height={250}
          next={() => {
            setTimeout(() => {
              setDataLength(dataLength + 1);
              setHeight(height + 500);
            }, 500);
          }}
          hasMore={true}
        >
          <div
            className={css("border-[1px]", "border-dashed", "border-red-300")}
            style={{
              height,
              backgroundSize: "15px 15px",
              backgroundImage:
                "linear-gradient(to right, #afafaf 1px, transparent 1px), linear-gradient(to bottom, #afafaf 1px, transparent 1px)",
            }}
          />
        </InfiniteScroll>
      </Variant>
      <Variant title={"Scroll By Document"} className={css("mt-2")}>
        <div className={css("flex", "justify-center", "mb-4")}>
          <Button
            onClick={() => {
              setFullPageHasMoreData(!fullPageHasMoreData);
              setDataLength(0);
              setFullScrollHeight(200);
            }}
          >
            {fullPageHasMoreData
              ? "stop infinite scroll"
              : "enable infinite scroll"}
          </Button>
        </div>
        <InfiniteScroll
          dataLength={dataLength}
          next={() => {
            setTimeout(() => {
              setDataLength(dataLength + 1);
              setFullScrollHeight(fullScrollHeight + 100);
            }, 500);
          }}
          hasMore={fullPageHasMoreData}
          endDataMessage={"🤗 that's all 🤗"}
        >
          <div
            className={css("border-[1px]", "border-dashed", "border-red-300")}
            style={{
              height: fullScrollHeight,
              backgroundSize: "15px 15px",
              backgroundImage:
                "linear-gradient(to right, #afafaf 1px, transparent 1px), linear-gradient(to bottom, #afafaf 1px, transparent 1px)",
            }}
          />
        </InfiniteScroll>
      </Variant>
    </Demo>
  );
};

export default InfiniteScrollDemo;
