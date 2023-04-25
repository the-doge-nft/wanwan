import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { observer } from "mobx-react-lite";
import { PropsWithChildren } from "react";
import { useFormState } from "react-final-form";
import { css } from "../../../helpers/css";
import { ConnectedButton } from "../../Button/ConnectedButton";
import Spinner, { SpinnerSize } from "../Spinner/Spinner";
import Text, { TextSize, TextType } from "../Text/Text";
import { borderColorCss } from "../Theme";

enum ButtonType {
  Primary = "primary",
}

export enum ButtonSize {
  xs = "xs",
  sm = "sm",
  lg = "lg",
}

export interface ButtonProps {
  onClick?: () => void;
  type?: ButtonType;
  size?: ButtonSize;
  submit?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  block?: boolean;
  round?: boolean;
  stretch?: boolean;
}

const buttonTypeStyles = {
  [ButtonType.Primary]: css(
    "bg-gray-200",
    "dark:bg-neutral-800",
    "hover:bg-gray-300",
    "dark:hover:bg-neutral-900",
    "border-[1px]",
    "text-black",
    "dark:text-white",
    "disabled:cursor-not-allowed",
    "disabled:hover:bg-gray-400",
    "disabled:bg-gray-400",
    "disabled:text-gray-500",
    "disabled:dark:bg-neutral-900",
    "disabled:dark:hover:bg-neutral-900",
    "disabled:dark:text-neutral-700",
    "inline-flex",
    "items-center",
    "justify-center",
    borderColorCss
  ),
};

const buttonSizeStyles = {
  [ButtonSize.xs]: css("px-0.5"),
  [ButtonSize.sm]: css("py-0.5", "px-1", "text-xs"),
  [ButtonSize.lg]: css("px-1", "py-0.5"),
};

const buttonSizeToTypeSize = {
  [ButtonSize.xs]: TextSize.xs,
  [ButtonSize.sm]: TextSize.sm,
  [ButtonSize.lg]: TextSize.sm,
};

const Button: React.FC<PropsWithChildren<ButtonProps>> = ({
  children,
  onClick,
  submit,
  type = ButtonType.Primary,
  size = ButtonSize.sm,
  disabled = false,
  isLoading = false,
  block,
  round,
  stretch,
}) => {
  return (
    <button
      disabled={disabled || isLoading}
      type={submit ? "submit" : "button"}
      onClick={onClick}
      className={css(
        buttonTypeStyles[type],
        buttonSizeStyles[size],
        "relative",
        "outline-0",
        {
          "w-full": block,
          "rounded-full": round,
          "rounded-sm": !round,
          "h-full": stretch,
        }
      )}
    >
      <Text type={TextType.NoColor} size={buttonSizeToTypeSize[size]}>
        {children}
      </Text>
      {isLoading && (
        <div
          className={css(
            "absolute",
            "w-full",
            "h-full",
            "inset-0",
            "flex",
            "items-center",
            "justify-center",
            "bg-gray-200",
            "dark:bg-neutral-900"
          )}
        >
          <Spinner
            size={size === ButtonSize.sm ? SpinnerSize.sm : SpinnerSize.lg}
          />
        </div>
      )}
    </button>
  );
};

export const Submit: React.FC<PropsWithChildren<ButtonProps>> = ({
  children,
  ...rest
}) => {
  const state = useFormState();
  return (
    <Button
      {...rest}
      isLoading={state.submitting || rest.isLoading}
      disabled={
        (!state.pristine && !state.dirty) || !state.valid || rest.disabled
      }
      submit
    >
      {children ? children : "Submit"}
    </Button>
  );
};

export const ConnectButton: React.FC<
  PropsWithChildren<
    Pick<ButtonProps, "type" | "size" | "block"> & {
      onConnectClick?: () => void;
    }
  >
> = observer(
  ({
    type = ButtonType.Primary,
    size = ButtonSize.sm,
    onConnectClick,
    block,
  }) => {
    return (
      <>
        <RainbowConnectButton.Custom>
          {({
            account,
            chain,
            openChainModal,
            openConnectModal,
            mounted,
            authenticationStatus,
          }) => {
            const shouldRenderConnect =
              !mounted ||
              !account ||
              !chain ||
              authenticationStatus === "loading" ||
              authenticationStatus === "unauthenticated";
            return (
              <div
                {...(!mounted && {
                  "aria-hidden": true,
                  style: {
                    opacity: 0,
                    pointerEvents: "none",
                    userSelect: "none",
                  },
                })}
              >
                {(() => {
                  if (shouldRenderConnect) {
                    return (
                      <Button
                        block={block}
                        size={size}
                        type={type}
                        onClick={() => {
                          openConnectModal();
                          onConnectClick && onConnectClick();
                        }}
                      >
                        Connect
                      </Button>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <Button
                        block={block}
                        size={size}
                        type={type}
                        onClick={openChainModal}
                      >
                        Wrong network
                      </Button>
                    );
                  }

                  return (
                    <div>
                      <ConnectedButton
                        chain={chain}
                        account={account}
                        type={type}
                        size={size}
                      />
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </RainbowConnectButton.Custom>
      </>
    );
  }
);

export default Button;
