import { Nft, OwnedNft } from "alchemy-sdk";
import { observer } from "mobx-react-lite";
import { useCallback, useMemo, useRef } from "react";
import { objectKeys } from "../../helpers/arrays";
import { css } from "../../helpers/css";
import { abbreviate } from "../../helpers/strings";
import { ERC20Balance, Nullable, Wallet } from "../../interfaces";
import WalletStore from "../../store/Wallet.store";
import Accordion from "../DSL/Accordion/Accordion";
import AspectRatio from "../DSL/AspectRatio/AspectRatio";
import Text, { TextSize, TextType } from "../DSL/Text/Text";
import Logo from "../Logo/Logo";

interface WalletProps {
  wallet: Wallet;
  showAll?: boolean;
  selectedAddress?: Nullable<string>;
  filterContractAddresses?: string[];
  onNFTAddressSelected?: (params: {
    address: string;
    nfts: OwnedNft[];
  }) => void;
  onERC20AddressSelected?: (params: {
    address: string;
    balance: ERC20Balance[];
  }) => void;
  renderNftSelection?: (params: {
    address: string;
    nfts: OwnedNft[];
  }) => JSX.Element;
  renderErc20Selection?: (params: {
    address: string;
    balance: ERC20Balance[];
  }) => JSX.Element;
}

const WalletView = observer(
  ({
    wallet,
    onNFTAddressSelected: onERC721AddressSelected,
    onERC20AddressSelected,
    showAll = true,
    renderNftSelection: renderSelection,
    renderErc20Selection,
    filterContractAddresses,
    selectedAddress,
  }: WalletProps) => {
    const store = useMemo(
      () =>
        new WalletStore(
          wallet,
          showAll,
          filterContractAddresses,
          selectedAddress
        ),
      [wallet, showAll, filterContractAddresses, selectedAddress]
    );
    const selectorRef = useRef<HTMLDivElement>(null);

    const renderDefaultNfts = useCallback(
      () => (
        <div
          className={css("grow", "grid", "grid-cols-3", "overflow-y-auto")}
          style={
            selectorRef.current?.clientHeight
              ? { maxHeight: selectorRef.current.clientHeight }
              : { maxHeight: "150px" }
          }
        >
          {store?.selectedNfts?.map((nft, index) => (
            <NftPreview
              key={`${nft.tokenId}-${nft.contract.address}-${index}`}
              nft={nft}
            />
          ))}
        </div>
      ),
      [store.selectedNfts]
    );

    return (
      <div>
        <div className={css("mt-2")}>
          <Accordion>
            <Accordion.Item value={"NFTs"} trigger={<Text>NFTs</Text>}>
              {!store.hasNfts && <NoneFound />}
              {store.hasNfts && (
                <div className={css("grid", "grid-cols-6", "gap-4")}>
                  <div className={css("col-span-2")}>
                    <div
                      className={css(
                        "flex",
                        "flex-col",
                        "gap-1",
                        "min-h-[150px]",
                        "overflow-y-auto"
                      )}
                      ref={selectorRef}
                    >
                      {store.showAll && (
                        <Selector
                          address={"all"}
                          title={store.getNftContractTitle("all")}
                          count={store.getSelectedNftsCount("all")}
                          isSelected={store.selectedAddress === "all"}
                          onClick={() => {
                            store.selectedAddress = "all";
                            if (onERC721AddressSelected) {
                              onERC721AddressSelected({
                                address: "all",
                                nfts: store.allNfts,
                              });
                            }
                          }}
                        />
                      )}
                      {objectKeys(store.nftsByAddress).map((address) => (
                        <Selector
                          key={`address-selector-${address}`}
                          address={address as string}
                          title={store.getNftContractTitle(address)}
                          count={store.getSelectedNftsCount(address)}
                          isSelected={store.selectedAddress === address}
                          onClick={() => {
                            store.selectedAddress = address;
                            if (onERC721AddressSelected) {
                              onERC721AddressSelected({
                                address: address as string,
                                nfts: store.nftsByAddress[address],
                              });
                            }
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className={css("col-span-4", "flex", "flex-col")}>
                    {renderSelection &&
                      renderSelection({
                        address: store.selectedAddress! as string,
                        nfts: store.selectedNfts,
                      })}
                    {!renderSelection && renderDefaultNfts()}
                  </div>
                </div>
              )}
            </Accordion.Item>
            <Accordion.Item value={"erc20"} trigger={<Text>ERC20</Text>}>
              {!store.hasERC20s && <NoneFound />}
              {store.hasERC20s && (
                <div className={css("grid", "grid-cols-6", "gap-4")}>
                  <div className={css("col-span-2")}>
                    <div
                      className={css(
                        "flex",
                        "flex-col",
                        "gap-1",
                        "min-h-[150px]",
                        "overflow-y-auto"
                      )}
                      ref={selectorRef}
                    >
                      {store.showAll && (
                        <Selector
                          key={`erc-20-all`}
                          address={"all"}
                          title={"All"}
                          isSelected={store.selectedAddress === "all"}
                          onClick={() => {
                            store.selectedAddress = "all";
                            if (onERC20AddressSelected) {
                              onERC20AddressSelected({
                                address: "all",
                                balance: store.selectedERC20Balances,
                              });
                            }
                          }}
                        />
                      )}
                      {objectKeys(store.erc20ByAddress).map((address) => (
                        <Selector
                          key={`contract-selector-${address}`}
                          title={store.getErc20ContractTitle(address)}
                          address={address as string}
                          isSelected={store.selectedAddress === address}
                          onClick={() => {
                            store.selectedAddress = address;
                            if (onERC20AddressSelected) {
                              onERC20AddressSelected({
                                address: store.selectedAddress! as string,
                                balance: store.selectedERC20Balances,
                              });
                            }
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className={css("col-span-4")}>
                    {renderErc20Selection &&
                      renderErc20Selection({
                        address: store.selectedAddress! as string,
                        balance: store.selectedERC20Balances,
                      })}
                  </div>
                </div>
              )}
            </Accordion.Item>
          </Accordion>
        </div>
      </div>
    );
  }
);

const NoneFound = () => {
  return (
    <div className={css("flex", "flex-col", "items-center", "gap-1", "py-4")}>
      <Text type={TextType.Grey}>ಠ_ಠ</Text>
      <Text type={TextType.Grey}>None found</Text>
    </div>
  );
};

interface NftPreviewProps {
  nft: OwnedNft | Nft;
  size?: "lg" | "sm";
  showName?: boolean;
  onClick?: (nft: OwnedNft | Nft) => void;
}

export const NftPreview = observer(
  ({ nft, size = "lg", showName = true, onClick }: NftPreviewProps) => {
    const thumbnail = nft.media?.[0]?.thumbnail;
    return (
      <div className={css("break-words", "inline-block")}>
        <span
          onClick={() => onClick && onClick(nft)}
          className={css("inline-block")}
        >
          <AspectRatio
            ratio={"1/1"}
            className={css(
              "bg-no-repeat",
              "bg-cover",
              "border-[1px]",
              "border-transparent",
              "rounded-sm",
              {
                "bg-gray-100 dark:bg-neutral-800": !thumbnail,
                "hover:border-black hover:dark:border-white cursor-pointer":
                  !!onClick,
                "w-[100px]": size === "lg",
                "w-[50px]": size === "sm",
              }
            )}
          >
            {thumbnail && (
              <img
                src={thumbnail}
                alt={thumbnail}
                className={css("rounded-sm")}
              />
            )}
            {!thumbnail && (
              <div className={css("flex", "justify-center", "items-center")}>
                <Text>
                  <Logo size={24} />
                </Text>
              </div>
            )}
          </AspectRatio>
        </span>

        {showName && (
          <div className={css("flex", "gap-1", "mt-0.5")}>
            <Text size={TextSize.xxs}>
              {nft.title ? nft.title : "<no name>"}
            </Text>
          </div>
        )}
      </div>
    );
  }
);

interface ContractSelectorProps {
  store: WalletStore;
  address: string | number;
  onClick?: (address: string | number) => void;
}

interface SelectorProps {
  onClick: (address: string) => void;
  address: string;
  isSelected: boolean;
  title: string;
  count?: number;
}

const Selector = observer(
  ({ onClick, address, isSelected, title, count }: SelectorProps) => {
    return (
      <div
        onClick={() => onClick(address)}
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
              isSelected,
            "border-transparent": !isSelected,
          }
        )}
      >
        <Text ellipses type={isSelected ? TextType.Primary : TextType.Grey}>
          {title ? title : abbreviate(address as string)}
        </Text>
        {count && (
          <Text size={TextSize.xs} type={TextType.Grey}>
            ({count})
          </Text>
        )}
      </div>
    );
  }
);

export default WalletView;
