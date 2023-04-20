import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useState } from "react";
import { useDisconnect } from "wagmi";
import { css } from "../../helpers/css";
import AppStore from "../../store/App.store";
import Button, { ButtonProps } from "../DSL/Button/Button";
import Dropdown, { DropdownItem } from "../DSL/Dropdown/Dropdown";
import Text, { TextSize, TextType } from "../DSL/Text/Text";

interface ConnectedButtonProps extends Pick<ButtonProps, "size" | "type"> {
  chain: {
    hasIcon: boolean;
    iconUrl?: string;
    iconBackground?: string;
    id: number;
    name?: string;
    unsupported?: boolean;
  };
  account: {
    address: string;
    balanceDecimals?: number;
    balanceFormatted?: string;
    balanceSymbol?: string;
    displayBalance?: string;
    displayName: string;
    ensAvatar?: string;
    ensName?: string;
    hasPendingTransactions: boolean;
  };
}

export const ConnectedButton = observer(
  ({ account, type, size, chain }: ConnectedButtonProps) => {
    const { disconnect } = useDisconnect();
    const [isDropDownOpen, setIsDropDownOpen] = useState(false);
    return (
      <Dropdown
        open={isDropDownOpen}
        onOpenChange={setIsDropDownOpen}
        trigger={
          <Button type={type} size={size}>
            {AppStore.auth.displayName}
          </Button>
        }
      >
        <div className={css("flex", "flex-col", "gap-2", "mt-1.5")}>
          <DropdownItem>
            <Link
              href={`/profile/${account.address}/meme`}
              className={css("w-full")}
            >
              <Button block>Profile</Button>
            </Link>
          </DropdownItem>
          <DropdownItem>
            <Button
              block
              onClick={() => {
                AppStore.modals.isSettingsModalOpen = true;
              }}
            >
              Settings
            </Button>
          </DropdownItem>
          {AppStore.auth.isAdmin && (
            <DropdownItem>
              <Button
                block
                onClick={() => {
                  AppStore.modals.isAdminModalOpen = true;
                }}
              >
                Admin
              </Button>
            </DropdownItem>
          )}
          <DropdownItem>
            <Button block onClick={() => disconnect()}>
              Disconnect
            </Button>
          </DropdownItem>
        </div>
        <DropdownItem className={css("mt-2")}>
          <div className={css("flex", "justify-end", "text-xs", "w-full")}>
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
    );
  }
);
