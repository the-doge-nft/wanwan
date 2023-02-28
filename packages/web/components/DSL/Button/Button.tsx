import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { observer } from "mobx-react-lite";
import { PropsWithChildren, useState } from "react";
import { BsFillMoonFill, BsFillSunFill } from "react-icons/bs";
import { useDisconnect } from "wagmi";
import { css } from "../../../helpers/css";
import AppStore from "../../../store/App.store";
import Dropdown, { DropdownItem } from "../Dropdown/Dropdown";
import Link from "../Link/Link";
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

interface ButtonProps {
  onClick?: () => void;
  type?: ButtonType;
  size?: ButtonSize;
  submit?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  block?: boolean;
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
  [ButtonSize.xs]: css(),
  [ButtonSize.sm]: css("py-0.5", "px-1", "rounded-sm", "text-xs"),
  [ButtonSize.lg]: css("px-1", "py-0.5", "rounded-sm"),
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
        { "w-full": block }
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
  return (
    <Button {...rest} submit>
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
    const { disconnect } = useDisconnect();
    const [isDropDownOpen, setIsDropDownOpen] = useState(false);
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
            console.log("debug:: authenctication status", authenticationStatus);
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
                      <Dropdown
                        open={isDropDownOpen}
                        onOpenChange={setIsDropDownOpen}
                        trigger={
                          <Button type={type} size={size}>
                            {account.displayName}
                          </Button>
                        }
                      >
                        <DropdownItem>
                          <Link href={`/profile/${account.address}/meme`}>
                            <Text type={TextType.NoColor}>Profile</Text>
                          </Link>
                        </DropdownItem>
                        {AppStore.auth.isAuthed && (
                          <div className={css("my-2")}>
                            <DropdownItem>
                              <div className={css("flex", "flex-col", "gap-2")}>
                                <Button
                                  onClick={() =>
                                    (AppStore.modals.isCreateMemeModalOpen =
                                      true)
                                  }
                                >
                                  + Meme
                                </Button>
                                <Button
                                  onClick={() =>
                                    (AppStore.modals.isCreateCompetitionModalOpen =
                                      true)
                                  }
                                >
                                  + Competition
                                </Button>
                              </div>
                            </DropdownItem>
                            <DropdownItem className={css("mt-2")}>
                              <div
                                className={css(
                                  "flex",
                                  "justify-end",
                                  "w-full",
                                  "gap-2"
                                )}
                              >
                                <Button
                                  disabled={AppStore.settings.isLightMode}
                                  onClick={() =>
                                    AppStore.settings.setColorMode("light")
                                  }
                                >
                                  <div className={css("py-0.5")}>
                                    <BsFillSunFill size={12} />
                                  </div>
                                </Button>
                                <Button
                                  disabled={!AppStore.settings.isLightMode}
                                  onClick={() =>
                                    AppStore.settings.setColorMode("dark")
                                  }
                                >
                                  <div className={css("py-0.5")}>
                                    <BsFillMoonFill size={12} />
                                  </div>
                                </Button>
                              </div>
                            </DropdownItem>
                          </div>
                        )}
                        <DropdownItem className={css("mt-2")}>
                          <div
                            className={css(
                              "flex",
                              "justify-between",
                              "text-xs",
                              "w-full"
                            )}
                          >
                            <button
                              className={css("hover:underline")}
                              onClick={() => disconnect()}
                            >
                              <Text size={TextSize.sm}>Disconnect</Text>
                            </button>
                            <div
                              className={css(
                                "flex",
                                "items-center",
                                "space-x-1",
                                "justify-between"
                              )}
                            >
                              <Text type={TextType.Grey} size={TextSize.xs}>
                                net:
                              </Text>
                              <Text type={TextType.Grey} size={TextSize.xs}>
                                {chain.name}
                              </Text>
                            </div>
                          </div>
                        </DropdownItem>
                      </Dropdown>
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
