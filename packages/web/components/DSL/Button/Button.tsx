import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { PropsWithChildren, useState } from "react";
import { useDisconnect } from "wagmi";
import { css } from "../../../helpers/css";
import AppStore from "../../../store/App.store";
import Dropdown, { DropdownItem } from "../Dropdown/Dropdown";
import Link from "../Link/Link";
import Spinner from "../Spinner/Spinner";

enum ButtonType {
  Primary = "primary",
}

export enum ButtonSize {
  sm = "small",
  lg = "large",
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
    "border-[1px]",
    "border-black",
    "hover:bg-gray-300"
  ),
};

const buttonSizeStyles = {
  [ButtonSize.sm]: css("py-0.5", "px-1", "rounded-sm", "text-sm"),
  [ButtonSize.lg]: css("px-2", "py-1", "rounded-sm"),
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
        "disabled:cursor-not-allowed",
        "outline-0",
        { "w-full": block }
      )}
    >
      {children}
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
            "bg-gray-200"
          )}
        >
          <Spinner />
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
    Pick<ButtonProps, "type" | "size"> & { onConnectClick?: () => void }
  >
> = ({ type = ButtonType.Primary, size = ButtonSize.sm, onConnectClick }) => {
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
                      size={size}
                      type={type}
                      onClick={() => {
                        openConnectModal();
                        onConnectClick && onConnectClick();
                      }}
                    >
                      connect
                    </Button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <Button size={size} type={type} onClick={openChainModal}>
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
                        <Button type={type}>{account.displayName}</Button>
                      }
                    >
                      <DropdownItem>
                        <Link href={`/profile/${account.address}`}>
                          Profile
                        </Link>
                      </DropdownItem>
                      {AppStore.auth.isAuthed && (
                        <div className={css("my-2")}>
                          <DropdownItem>
                            <div className={css("flex", "flex-col", "gap-2")}>
                              <Button
                                onClick={() =>
                                  (AppStore.modals.isCreateMemeModalOpen = true)
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
                        </div>
                      )}
                      <div className={css("mt-2")}>
                        <DropdownItem>
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
                              Disconnect
                            </button>
                            <div
                              className={css(
                                "flex",
                                "items-center",
                                "space-x-1",
                                "justify-between",
                                "text-gray-500",
                                "text-xs"
                              )}
                            >
                              <div>net:</div>
                              <div className={css("flex", "items-center")}>
                                {chain.name}
                              </div>
                            </div>
                          </div>
                        </DropdownItem>
                      </div>
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
};

export default Button;