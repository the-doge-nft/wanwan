import { OwnedNft } from "alchemy-sdk";
import { observer } from "mobx-react-lite";
import { useMemo, useRef } from "react";
import { objectKeys } from "../../helpers/arrays";
import { css } from "../../helpers/css";
import { abbreviate } from "../../helpers/strings";
import { Wallet } from "../../interfaces";
import WalletStore from "../../store/Wallet.store";
import AspectRatio from "../DSL/AspectRatio/AspectRatio";
import Text, { TextSize, TextType } from "../DSL/Text/Text";
import Logo from "../Logo/Logo";

interface WalletProps {
  wallet: Wallet;
  showAll?: boolean;
  onERC721AddressClick?: (address: string | number) => void;
  renderSelection?: (params: {
    address: string;
    nfts: OwnedNft[];
  }) => JSX.Element;
}

const WalletView = observer(
  ({
    wallet,
    onERC721AddressClick,
    showAll = true,
    renderSelection,
  }: WalletProps) => {
    const store = useMemo(
      () => new WalletStore(wallet, showAll),
      [wallet, showAll]
    );
    const selectorRef = useRef<HTMLDivElement>(null);
    return (
      <div>
        <div className={css("mt-4")}>
          <Text>NFTs</Text>
          <div className={css("grid", "grid-cols-6", "gap-4")}>
            <div className={css("col-span-2")}>
              {objectKeys(store.nftsByAddress).length > 0 && (
                <div
                  className={css("flex", "flex-col", "gap-1", "min-h-[400px]")}
                  ref={selectorRef}
                >
                  {store.showAll && (
                    <ContractSelector
                      key={"all"}
                      store={store}
                      address={"all"}
                      onClick={(address) => {
                        if (onERC721AddressClick) {
                          onERC721AddressClick(address);
                        }
                      }}
                    />
                  )}
                  {objectKeys(store.nftsByAddress).map((address) => {
                    return (
                      <ContractSelector
                        key={`contract-selector-${address}`}
                        store={store}
                        address={address}
                        onClick={(address) => {
                          if (onERC721AddressClick) {
                            onERC721AddressClick(address);
                          }
                        }}
                      />
                    );
                  })}
                </div>
              )}
            </div>
            <div className={css("col-span-4", "flex", "flex-col")}>
              {renderSelection &&
                renderSelection({
                  address: store.selectedAddress! as string,
                  nfts: store.selectedNfts,
                })}
              {!renderSelection && (
                <div
                  className={css(
                    "grow",
                    "grid",
                    "grid-cols-3",
                    "overflow-y-auto"
                  )}
                  style={
                    selectorRef.current?.clientHeight
                      ? { maxHeight: selectorRef.current.clientHeight }
                      : { maxHeight: "400px" }
                  }
                >
                  {store.selectedNfts.map((nft, index) => (
                    <NftPreview
                      key={`${nft.tokenId}-${nft.contract.address}-${index}`}
                      nft={nft}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

const NftPreview = observer(({ nft }: { nft: any }) => {
  const thumbnail = nft.media?.[0]?.thumbnail;
  return (
    <div className={css("break-words", "inline-block")}>
      <AspectRatio
        ratio={"1/1"}
        className={css(
          "bg-no-repeat",
          "bg-contain",
          "w-[100px]",
          "border-[1px]",
          "border-transparent",
          "hover:border-black",
          "hover:dark:border-white",
          "cursor-pointer",
          "rounded-sm",
          { "bg-gray-100 dark:bg-neutral-800": !thumbnail }
        )}
        style={
          thumbnail
            ? {
                backgroundImage: `url(${thumbnail})`,
              }
            : {}
        }
      >
        {!thumbnail && (
          <div className={css("flex", "justify-center", "items-center")}>
            <Text>
              <Logo size={24} />
            </Text>
          </div>
        )}
      </AspectRatio>
      <div className={css("flex", "gap-1", "mt-0.5")}>
        <Text size={TextSize.xxs}>{nft.title ? nft.title : "<no name>"}</Text>
      </div>
    </div>
  );
});

interface ContractSelectorProps {
  store: WalletStore;
  address: string | number;
  onClick?: (address: string | number) => void;
}

const ContractSelector = observer(
  ({ store, address, onClick }: ContractSelectorProps) => {
    const title =
      address === "all" ? "All" : store.nftsByAddress[address][0].contract.name;
    return (
      <div
        onClick={() => {
          store.selectedAddress = address;
          if (onClick) {
            onClick(address);
          }
        }}
        className={css(
          "cursor-pointer",
          "border-[1px]",
          "py-0.5",
          "px-1",
          "hover:border-black",
          "flex",
          "justify-between",
          "items-center",
          "hover:bg-gray-100",
          "rounded-sm",
          "dark:hover:border-white",
          "dark:hover:bg-neutral-900",
          {
            "border-black dark:border-white bg-gray-100 dark:bg-neutral-900":
              store.selectedAddress === address,
            "border-transparent": store.selectedAddress !== address,
          }
        )}
      >
        <Text ellipses>{title ? title : abbreviate(address as string)}</Text>
        <Text size={TextSize.xs} type={TextType.Grey}>
          ({store.getSelectedNftsCount(address)})
        </Text>
      </div>
    );
  }
);

export default WalletView;
