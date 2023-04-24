import { observer } from "mobx-react-lite";
import { useMemo, useRef } from "react";
import { objectKeys } from "../../helpers/arrays";
import { css } from "../../helpers/css";
import { abbreviate, jsonify } from "../../helpers/strings";
import { Wallet } from "../../interfaces";
import WalletStore from "../../store/Wallet.store";
import AspectRatio from "../DSL/AspectRatio/AspectRatio";
import Text, { TextSize, TextType } from "../DSL/Text/Text";
import Logo from "../Logo/Logo";

interface WalletProps {
  wallet: Wallet;
}

const WalletView = observer(({ wallet }: WalletProps) => {
  const store = useMemo(() => new WalletStore(wallet), [wallet]);
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
                <ContractSelector key={"all"} store={store} address={"all"} />
                {objectKeys(store.nftsByAddress).map((address) => {
                  return (
                    <ContractSelector
                      key={address}
                      store={store}
                      address={address}
                    />
                  );
                })}
              </div>
            )}
          </div>
          <div className={css("col-span-4", "flex", "flex-col")}>
            <div
              className={css("grow", "grid", "grid-cols-3", "overflow-y-auto")}
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
          </div>
        </div>
      </div>
    </div>
  );
});

const NftPreview = observer(({ nft }: { nft: any }) => {
  if (!nft.title) {
    console.log("nft", jsonify(nft));
  }
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
}

const ContractSelector = ({ store, address }: ContractSelectorProps) => {
  const title =
    address === "all" ? "All" : store.nftsByAddress[address][0].contract.name;
  return (
    <div
      onClick={() => (store.selectedAddress = address)}
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
};

export default WalletView;
