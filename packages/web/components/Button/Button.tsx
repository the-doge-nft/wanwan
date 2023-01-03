import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";
import { PropsWithChildren, useEffect, useState } from "react";
import { useDisconnect } from "wagmi";
import { css } from "../../helpers/css";
import Dropdown from "../Dropdown/Dropdown";

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
  type = ButtonType.Primary,
  size = ButtonSize.sm,
}) => {
  return (
    <button
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
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  useEffect(() => {
    if (isDropDownOpen) {
      setIsDropDownOpen(false);
    }
  }, [router.pathname]);
  return (
    <>
      <RainbowConnectButton.Custom>
        {({ account, chain, openChainModal, openConnectModal, mounted }) => {
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
                if (!mounted || !account || !chain) {
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
                  <div style={{ display: "flex", gap: 12 }}>
                    <Dropdown
                      open={isDropDownOpen}
                      onOpenChange={setIsDropDownOpen}
                      trigger={
                        <Button type={type}>{account.displayName}</Button>
                      }
                    >
                      {/* <Dropdown.Item> */}
                      {/* <Link
                          bold
                          block
                          href={`/profile/${account.address}`}
                          size={LinkSize.xl}
                        >
                          Profile
                        </Link> */}
                      {/* </Dropdown.Item> */}
                      <div className={css("mt-5", "text-base")}>
                        <Dropdown.Item>
                          <div
                            onClick={() => disconnect()}
                            className={css(
                              "cursor-pointer",
                              "text-right",
                              "font-bold"
                              // linkStyles
                            )}
                          >
                            Disconnect
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item>
                          <div
                            className={css(
                              "flex",
                              "items-center",
                              "space-x-2",
                              "cursor-pointer",
                              "justify-between",
                              "font-bold"
                              // linkStyles
                            )}
                            onClick={openChainModal}
                          >
                            <div>network:</div>
                            <div className={css("flex", "items-center")}>
                              {chain.name}
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
