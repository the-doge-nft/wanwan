import { observer } from "mobx-react-lite";
import { PropsWithChildren, useCallback } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { css } from "../../../helpers/css";
import Text, { TextType } from "../Text/Text";
import { borderColorCss } from "../Theme";

export enum PaneType {
  Primary = "primary",
  Secondary = "secondary",
  Grey = "grey",
}

interface PaneProps {
  title?: React.ReactNode;
  type?: PaneType;
  rightOfTitle?: React.ReactNode;
  padding?: boolean;
}

const Pane: React.FC<PropsWithChildren<PaneProps>> = observer(
  ({
    children,
    title,
    type = PaneType.Primary,
    rightOfTitle,
    padding = true,
  }) => {
    const basePaneStyles = {
      container: css("border-[1px]", borderColorCss),
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
      [PaneType.Primary]: {
        title: css("bg-slate-300", "dark:bg-slate-800"),
        container: css("bg-slate-100", "border-[1px]"),
        body: css(),
      },
      [PaneType.Secondary]: {
        title: css("bg-red-800"),
        container: css(),
        body: css(),
      },
      [PaneType.Grey]: {
        title: css("bg-neutral-300", "dark:bg-neutral-800"),
        container: css(),
        body: css(),
      },
    };
    return (
      <div
        className={
          (css(paneTypeStyles[type].container), basePaneStyles.container)
        }
      >
        {title && (
          <div
            className={css(paneTypeStyles[type].title, basePaneStyles.title)}
          >
            <div className={css("grow")}>
              <Text
                type={
                  type === PaneType.Primary || type === PaneType.Grey
                    ? TextType.Primary
                    : TextType.White
                }
              >
                {title}
              </Text>
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
  onChange: (isExpanded: boolean) => void;
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
        <Text
          type={
            rest.type === PaneType.Primary || !rest.type
              ? TextType.Primary
              : TextType.White
          }
        >
          {isExpanded ? (
            <AiOutlineMinus size={16} />
          ) : (
            <AiOutlinePlus size={16} />
          )}
        </Text>
      </div>
    );
  }, [isExpanded, onChange]);
  return (
    <Pane {...rest} rightOfTitle={renderRightOfTitle()}>
      {isExpanded && children}
    </Pane>
  );
});

export default Pane;
