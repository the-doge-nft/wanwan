import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import { css } from "../../helpers/css";
import { Wallet as WalletI } from "../../interfaces";
import CreateCompetitionStore from "../../store/CreateCompetition/CreateCompetition.store";
import RewardInputStore from "../../store/CreateCompetition/RewardInput.store";
import Button from "../DSL/Button/Button";
import Form from "../DSL/Form/Form";
import { FormDisplay } from "../DSL/Form/FormControl";
import { Buttons, CompetitionStoreProp } from "./CreateCompetition";
import Wallet from "./Wallet";

interface RewardsViewProps {
  store: CreateCompetitionStore;
}

const RewardsView = observer(({ store }: CompetitionStoreProp) => {
  return (
    <Form onSubmit={async () => store.onRewardsSubmit()}>
      <FormDisplay
        label={"Rewards"}
        description={"What are you offering for the best memes?"}
      />
      <div className={css("break-words")}></div>
      {store.rewardStore.isRewardsVisible && (
        <div className={css("flex", "flex-col", "gap-6")}>
          {store.rewardStore.rewards.map((rewardStore, index) => {
            if (store.wallet) {
              return (
                <RewardInputItem
                  key={`reward-input-item-${index}`}
                  index={index}
                  wallet={store.wallet}
                />
              );
            }
            return <></>;
          })}
        </div>
      )}
      <div className={css("flex", "items-center", "gap-2", "mt-2")}>
        <Button
          block
          onClick={() => store.rewardStore.addReward()}
          disabled={!store.rewardStore.canAddReward}
        >
          + Reward
        </Button>
      </div>
      <Buttons store={store} />
    </Form>
  );
});

interface RewardInputItemProps {
  index: number;
  wallet: WalletI;
}

const RewardInputItem = observer(({ index, wallet }: RewardInputItemProps) => {
  const place = index + 1;
  let prefix = "st";
  if (place === 2) {
    prefix = "nd";
  } else if (place === 3) {
    prefix = "rd";
  }
  const store = useMemo(() => new RewardInputStore(), []);
  return (
    <div key={`reward-input-${index}`} className={css()}>
      <div
        className={css(
          "text-xs",
          "text-neutral-600",
          "dark:text-neutral-400",
          "mb-1"
        )}
      >
        {place}
        {prefix} place
      </div>
      <div className={css("flex", "gap-2")}>
        <Wallet
          wallet={wallet}
          showAll={false}
          selectedAddress={store.contractAddress}
          // filterContractAddresses={store.votersStore.getAddressesToHide(index)}
          // onNFTAddressSelected={({ address, nfts }) => {
          //   const type = nfts?.[0].contract.tokenType;
          //   voteInputStore.setInput(
          //     address,
          //     type === NftTokenType.ERC1155
          //       ? TokenType.ERC1155
          //       : TokenType.ERC721,
          //     nfts?.[0].contract.name
          //   );
          // }}
          // onERC20AddressSelected={({ address, balance }) => {
          //   const name = balance[0]?.metadata?.name;
          //   voteInputStore.setInput(address, TokenType.ERC20, name);
          // }}
          // renderNftSelection={({ address, nfts }) => {
          //   const contract = nfts?.[0].contract;
          //   return (
          //     <div
          //       className={css(
          //         "flex",
          //         "flex-col",
          //         "items-center",
          //         "grow"
          //       )}
          //     >
          //       {contract && (
          //         <>
          //           <div className={css("grow", "flex", "flex-col")}>
          //             <div className={css("text-center")}>
          //               <Text>
          //                 Holders of{" "}
          //                 <Link
          //                   isExternal
          //                   href={getLooksRareCollectionURL(
          //                     contract.address
          //                   )}
          //                 >
          //                   {contract.name
          //                     ? contract.name
          //                     : abbreviate(contract.address)}
          //                 </Link>{" "}
          //                 will be able to vote
          //               </Text>
          //             </div>
          //             <div
          //               className={css(
          //                 "mt-4",
          //                 "flex",
          //                 "gap-1",
          //                 "grow",
          //                 "items-center",
          //                 "justify-center",
          //                 "flex-wrap"
          //               )}
          //             >
          //               {!voteInputStore.isLoadingNfts &&
          //                 voteInputStore.nfts
          //                   .slice(0, 5)
          //                   .map((nft) => (
          //                     <NftPreview
          //                       key={`nft-preview-${nft.contract.address}-${nft.tokenId}`}
          //                       size={"sm"}
          //                       nft={nft}
          //                       showName={false}
          //                     />
          //                   ))}
          //               {voteInputStore.isLoadingNfts && <Spinner />}
          //             </div>
          //           </div>
          //           <div
          //             className={css(
          //               "grow",
          //               "w-full",
          //               "flex",
          //               "justify-end",
          //               "flex-col",
          //               "gap-3"
          //             )}
          //           >
          //             <ContractInfo
          //               address={contract.address}
          //               tokenType={contract.tokenType}
          //               supply={contract.totalSupply}
          //               holdersCount={voteInputStore.holdersLength}
          //               isHoldersLoading={
          //                 voteInputStore.isLoadingHolders
          //               }
          //             />
          //           </div>
          //         </>
          //       )}
          //     </div>
          //   );
          // }}
          // renderErc20Selection={({ address, balance }) => {
          //   if (balance.length === 0) return <></>;
          //   return (
          //     <div className={css("flex", "flex-col", "h-full")}>
          //       <div className={css("grow", "text-center")}>
          //         <Text>
          //           Holders of{" "}
          //           <Link
          //             isExternal
          //             href={getEtherscanURL(address, "token")}
          //           >
          //             {voteInputStore.name
          //               ? voteInputStore.name
          //               : abbreviate(address)}
          //           </Link>{" "}
          //           will be able to vote
          //         </Text>
          //       </div>
          //       <div className={css("grow", "flex", "items-end")}>
          //         <ContractInfo
          //           address={address}
          //           tokenType={TokenType.ERC20}
          //           showSupply={false}
          //           showHolders={false}
          //         />
          //       </div>
          //     </div>
          //   );
          // }}
        />
      </div>
    </div>
  );
});

export default RewardsView;
