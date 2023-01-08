import { throttle } from "lodash";
import React, {
  PropsWithChildren,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { css } from "../../../helpers/css";
import Spinner from "../Spinner/Spinner";

export interface InfinteScrollProps {
  next: () => any;
  hasMore: boolean;
  dataLength: number;
  height?: number;
  endDataMessage?: string;
  renderLoader?: () => ReactNode;
}

const InfiniteScroll: React.FC<PropsWithChildren<InfinteScrollProps>> = ({
  children,
  next,
  hasMore,
  dataLength,
  endDataMessage,
  height,
  renderLoader,
}) => {
  const [showLoader, setShowLoader] = useState(true);
  const [actionTriggered, setActionTriggered] = useState(false);
  const infiniteScrollRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback(
    (entries: any) => {
      const [target] = entries;
      const query = throttle(() => {
        setActionTriggered(true);
        setShowLoader(true);
        next();
      }, 500);

      if (target.isIntersecting && !actionTriggered && hasMore) {
        query();
      }
    },
    [actionTriggered, hasMore]
  );

  useEffect(() => {
    const root = height ? infiniteScrollRef.current : null;
    const options = {
      root,
      threshold: 0,
      rootMargin: "600px",
    };
    const observer = new IntersectionObserver(handleObserver, options);
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [handleObserver, actionTriggered, height]);

  // reset actionTriggered on new data loaded
  const previousDataLength = useRef<typeof dataLength | null>();
  useEffect(() => {
    if (dataLength !== previousDataLength.current) {
      setActionTriggered(false);
      setShowLoader(false);
    }
  }, [dataLength]);
  useEffect(() => {
    previousDataLength.current = dataLength;
  });

  const defaultEndMessage = "-";

  return (
    <div
      ref={infiniteScrollRef}
      className={css({
        "overflow-y-scroll": !!height,
        "h-full": !height,
      })}
      style={{ height }}
    >
      {children}
      {showLoader && hasMore && (
        <>
          {renderLoader && renderLoader()}
          {!renderLoader && (
            <div className={css("flex", "justify-center", "mt-14")}>
              <Spinner />
            </div>
          )}
        </>
      )}
      <div ref={loadMoreRef}>
        {!hasMore && dataLength > 0 && (
          <div
            className={css("text-sm", "text-slate-600", "text-center", "mt-14")}
          >
            {endDataMessage ? endDataMessage : defaultEndMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default InfiniteScroll;
