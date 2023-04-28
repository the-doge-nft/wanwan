import { OwnedNft } from "alchemy-sdk";
import { observer } from "mobx-react-lite";
import { BsCheckLg, BsPencil } from "react-icons/bs";
import { IoCloseOutline } from "react-icons/io5";
import { css } from "../../helpers/css";
import { jsonify } from "../../helpers/strings";
import { Wallet as WalletI } from "../../interfaces";
import CreateCompetitionStore from "../../store/CreateCompetition/CreateCompetition.store";
import CreateCompetitionRewardsStore from "../../store/CreateCompetition/CreateCompetitionRewards.store";
import RewardInputStore from "../../store/CreateCompetition/RewardInput.store";
import Button from "../DSL/Button/Button";
import Form from "../DSL/Form/Form";
import { FormDisplay } from "../DSL/Form/FormControl";
import Text from "../DSL/Text/Text";
import { Buttons } from "./CreateCompetition";
import Wallet from "./Wallet";

interface RewardsViewProps {
  store: CreateCompetitionStore;
}

const RewardsView = observer(({ store }: RewardsViewProps) => {
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
            return (
              <RewardInputItem
                key={`reward-input-item-${index}`}
                index={index}
                wallet={store.wallet!}
                onRemoveClick={() => store.rewardStore.removeReward(index)}
                nftsToFilter={store.rewardStore.getNftsToHide(index)}
                rewardStore={store.rewardStore}
                store={rewardStore}
              />
            );
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
  addressesToFilter?: string[];
  onRemoveClick: () => void;
  nftsToFilter?: OwnedNft[];
  rewardStore: CreateCompetitionRewardsStore;
  store: RewardInputStore;
}

const RewardInputItem = observer(
  ({
    index,
    wallet,
    addressesToFilter,
    onRemoveClick,
    nftsToFilter,
    rewardStore,
    store,
  }: RewardInputItemProps) => {
    const place = index + 1;
    let prefix = "st";
    if (place === 2) {
      prefix = "nd";
    } else if (place === 3) {
      prefix = "rd";
    }
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

        <div className={css("flex", "items-center", "justify-between")}>
          <div className={css("flex", "items-center", "gap-2")}>
            <Button onClick={() => onRemoveClick()}>
              <IoCloseOutline size={12} />
            </Button>
            {store.selectedDisplayName && (
              <Text>{store.selectedDisplayName}</Text>
            )}
          </div>
          <div className={css("flex", "items-center", "gap-2")}>
            {/* {store.tokenId && <Text>{store.tokenId}</Text>} */}
            {!store.isConfirmed &&
              store.showCanConfirm &&
              store.contractAddress && (
                <Button onClick={() => (store.isConfirmed = true)}>
                  <BsCheckLg size={14} />
                </Button>
              )}
            {store.isConfirmed && (
              <Button onClick={() => (store.isConfirmed = false)}>
                <BsPencil size={14} />
              </Button>
            )}
          </div>
        </div>

        {!store.isConfirmed && (
          <div className={css("flex", "gap-2", "w-full")}>
            <Wallet
              wallet={wallet}
              showAll={false}
              selectedAddress={store.contractAddress}
              selectedNft={store.selectedNft}
              nftsToFilter={rewardStore.getNftsToHide(index)}
              onNFTSelection={(nft) => store.setSelectedNft(nft)}
              onNFTAddressSelected={(nft) => store.onNFTAddressSelected(nft)}
              onERC20AddressSelected={(erc20) => store.setSelectedERC20(erc20)}
              filterContractAddresses={addressesToFilter}
              renderErc20Selection={(erc20) => {
                return (
                  <div className={css("break-words")}>{jsonify(erc20)}</div>
                );
              }}
              // renderErc20Selection={}
            />
          </div>
        )}
      </div>
    );
  }
);

export default RewardsView;
