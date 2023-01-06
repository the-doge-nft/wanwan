import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { PropsWithChildren, useState } from "react";
import { useDisconnect } from "wagmi";
import { css } from "../../helpers/css";
import Dropdown from "../Dropdown/Dropdown";
import Link from "../Link/Link";

enum ButtonType {
  Primary = "primary",
}

enum ButtonSize {
  sm = "small",
  lg = "large",
}

interface ButtonProps {
  onClick?: () => void;
  type?: ButtonType;
  size?: ButtonSize;
  submit?: boolean;
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
  [ButtonSize.sm]: css("p-0.5", "px-1", "rounded-sm", "text-base"),
  [ButtonSize.lg]: css("p-3"),
};

const Button: React.FC<PropsWithChildren<ButtonProps>> = ({
  children,
  onClick,
  submit,
  type = ButtonType.Primary,
  size = ButtonSize.sm,
}) => {
  return (
    <button
      type={submit ? "submit" : "button"}
      onClick={onClick}
      className={css(buttonTypeStyles[type], buttonSizeStyles[size])}
    >
      {children}
    </button>
  );
};

export const ConnectButton: React.FC<
  PropsWithChildren<{ type?: ButtonType }>
> = ({ type = ButtonType.Primary }) => {
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
                    <Button type={type} onClick={openConnectModal}>
                      connect
                    </Button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <Button type={type} onClick={openChainModal}>
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
                      <Dropdown.Item>
                        <Link href={`/profile/${account.address}`}>
                          Profile
                        </Link>
                      </Dropdown.Item>
                      <div className={css("mt-2")}>
                        <Dropdown.Item>
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
                        </Dropdown.Item>
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
