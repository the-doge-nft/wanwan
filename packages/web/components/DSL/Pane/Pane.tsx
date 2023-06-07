import { observer } from "mobx-react-lite";
import { PropsWithChildren, useCallback } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { css } from "../../../helpers/css";
import Text, { TextType } from "../Text/Text";
import { borderColorCss } from "../Theme";

export enum PaneType {
  Red = "red",
  Blue = "blue",
  Grey = "grey",
  Green = "green",
}

interface PaneProps {
  title?: React.ReactNode;
  type?: PaneType;
  rightOfTitle?: React.ReactNode;
  padding?: boolean;
}

const Pane: React.FC<PropsWithChildren<PaneProps>> = observer(
  ({ children, title, type = PaneType.Blue, rightOfTitle, padding = true }) => {
    const basePaneStyles = {
      container: css("border-[1px]"),
      title: css(
        "px-2",
        "py-1",
        "font-bold",
        "flex",
        "jusitfy-between",
        "items-center",
        "w-full"
      ),
      body: css("text-sm", { "p-2": children && padding }),
    };

    const paneTypeStyles = {
      [PaneType.Blue]: {
        title: css(
          "bg-slate-300",
          "dark:bg-slate-800",
          "text-black",
          "dark:text-white"
        ),
        container: css(borderColorCss),
        body: css(),
      },
      [PaneType.Red]: {
        title: css("bg-red-800", "text-white"),
        container: css(borderColorCss),
        body: css(),
      },
      [PaneType.Grey]: {
        title: css(
          "bg-neutral-300",
          "dark:bg-neutral-800",
          "text-black",
          "dark:text-white"
        ),
        container: css(borderColorCss),
        body: css(),
      },
      [PaneType.Green]: {
        title: css(
          "bg-lime-500",
          "dark:bg-lime-800",
          "text-lime-900",
          "dark:text-lime-300"
        ),
        container: css("border-lime-600", "dark:border-lime-900"),
        body: css("bg-lime-50", "dark:bg-transparent"),
      },
    };
    return (
      <div
        className={css(
          paneTypeStyles[type].container,
          basePaneStyles.container
        )}
      >
        {(title || rightOfTitle) && (
          <div
            className={css(
              paneTypeStyles[type].title,
              basePaneStyles.title,
              "gap-2"
            )}
          >
            <div
              className={css("grow", {
                "overflow-x-hidden text-ellipsis": typeof title === "string",
              })}
            >
              <Text type={TextType.NoColor}>{title}</Text>
            </div>
            {rightOfTitle && rightOfTitle}
          </div>
        )}
        {children && (
          <div className={css(paneTypeStyles[type].body, basePaneStyles.body)}>
            {children}
          </div>
        )}
      </div>
    );
  }
);

interface CollapsablePaneProps extends PaneProps {
  isExpanded: boolean;
  onChange: (isExpanded: boolean) => any;
}

export const CollapsablePane: React.FC<
  PropsWithChildren<CollapsablePaneProps>
> = observer(({ isExpanded, onChange, children, ...rest }) => {
  const renderRightOfTitle = useCallback(() => {
    return (
      <div
        className={css("cursor-pointer")}
        onClick={() => onChange(!isExpanded)}
      >
        {isExpanded ? (
          <AiOutlineMinus size={16} />
        ) : (
          <AiOutlinePlus size={16} />
        )}
      </div>
    );
  }, [isExpanded, onChange]);
  return (
    <Pane {...rest} rightOfTitle={renderRightOfTitle()}>
      {isExpanded && children}
    </Pane>
  );
});

export function expandPane<T extends Record<string, any>>(
  obj: T,
  key: keyof T
) {
  return {
    isExpanded: obj[key] as boolean,
    onChange: (value: boolean) => {
      obj.set(key as string, value);
    },
  };
}

export default Pane;
