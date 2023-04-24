import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import { objectKeys } from "../../helpers/arrays";
import { css } from "../../helpers/css";
import { abbreviate } from "../../helpers/strings";
import { Wallet } from "../../interfaces";
import WalletStore from "../../store/Wallet.store";
import AspectRatio from "../DSL/AspectRatio/AspectRatio";
import Text, { TextSize, TextType } from "../DSL/Text/Text";

interface WalletProps {
  wallet: Wallet;
}

const WalletView = observer(({ wallet }: WalletProps) => {
  const store = useMemo(() => new WalletStore(wallet), [wallet]);
  return (
    <div>
      <div className={css("mt-4")}>
        <Text>NFTs</Text>
        <div className={css("grid", "grid-cols-6", "gap-4")}>
          <div className={css("col-span-2")}>
            {objectKeys(store.nftsByAddress).length > 0 && (
              <div className={css("flex", "flex-col", "gap-1")}>
                <span
                  className={css(
                    "cursor-pointer",
                    "inline-block",
                    "border-[1px]",
                    "py-0.5",
                    "px-1",
                    "hover:border-black",
                    "flex",
                    "justify-between",
                    "items-center",
                    "hover:bg-gray-100",

                    {
                      "border-black bg-gray-100":
                        store.selectedAddress === "all",
                      "border-transparent": store.selectedAddress !== "all",
                    }
                  )}
                  onClick={() => (store.selectedAddress = "all")}
                >
                  <Text>All</Text>
                  <Text size={TextSize.xs} type={TextType.Grey}>
                    ({store.selectedNftsCount})
                  </Text>
                </span>
                {objectKeys(store.nftsByAddress).map((address) => {
                  const title = store.nftsByAddress[address][0].contract.name;
                  return (
                    <div
                      key={`address-selector-${address}`}
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

                        {
                          "border-black bg-gray-100":
                            store.selectedAddress === address,
                          "border-transparent":
                            store.selectedAddress !== address,
                        }
                      )}
                    >
                      <Text ellipses>
                        {title ? title : abbreviate(address as string)}
                      </Text>
                      <Text size={TextSize.xs} type={TextType.Grey}>
                        ({store.selectedNftsCount})
                      </Text>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className={css("col-span-4", "grid", "grid-cols-3")}>
            {store.selectedNfts.map((nft, index) => (
              <NftPreview
                key={`${nft.tokenId}-${nft.contract.address}-${index}`}
                nft={nft}
              />
            ))}
          </div>
        </div>

        {/* {wallet.nft.map((nft) => (
          <div className={css("break-words")} key={nft.contract + nft.tokenId}>
            {nft.media?.[0]?.thumbnail && (
              <AspectRatio
                ratio={"1/1"}
                className={css("bg-no-repeat", "bg-contain", "w-[50px]")}
                style={{ backgroundImage: `url(${nft.media?.[0]?.thumbnail})` }}
              />
            )}
            <div>
              <Text>{nft.balance}</Text>
              <Text>{nft.tokenType}</Text>
            </div>

            {objectKeys(nft).map((key, index) => (
              <div key={index} className={css("grid", "grid-cols-4")}>
                <Text>{key}:</Text>
                <div className={css("overflow-auto", "col-span-3")}>
                  <Text>{jsonify(nft[key as keyof typeof nft])}</Text>
                </div>
              </div>
            ))}
            <Divider />
          </div>
        ))} */}
      </div>
    </div>
  );
});

const NftPreview = observer(({ nft }: { nft: any }) => {
  return (
    <div className={css("break-words", "inline-block")}>
      {nft.media?.[0]?.thumbnail && (
        <AspectRatio
          ratio={"1/1"}
          className={css(
            "bg-no-repeat",
            "bg-contain",
            "w-[90px]",
            "border-[1px]",
            "border-transparent",
            "hover:border-black",
            "cursor-pointer"
          )}
          style={
            nft.media?.[0]?.thumbnail
              ? {
                  backgroundImage: `url(${nft.media?.[0]?.thumbnail})`,
                }
              : { background: "green" }
          }
        />
      )}
      <div className={css("flex", "gap-1")}>
        {/* <Text>{nft.balance}</Text> */}
        {/* <Text>{nft.tokenType}</Text> */}
        <Text size={TextSize.xxs}>{nft.title}</Text>
      </div>

      {/* {objectKeys(nft).map((key, index) => (
        <div key={index} className={css("grid", "grid-cols-4")}>
          <Text>{key}:</Text>
          <div className={css("overflow-auto", "col-span-3")}>
            <Text>{jsonify(nft[key as keyof typeof nft])}</Text>
          </div>
        </div>
      ))}
      <Divider /> */}
    </div>
  );
});

export default WalletView;
