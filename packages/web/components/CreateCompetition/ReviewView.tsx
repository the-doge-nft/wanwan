import { observer } from "mobx-react-lite";
import { css } from "../../helpers/css";
import {
  abbreviate,
  getEtherscanURL,
  getOpenSeaURL,
} from "../../helpers/strings";
import { TokenType } from "../../interfaces";
import AppStore from "../../store/App.store";
import RewardInputStore from "../../store/CreateCompetition/RewardInput.store";
import Form from "../DSL/Form/Form";
import Link from "../DSL/Link/Link";
import Pane from "../DSL/Pane/Pane";
import Text, { TextType } from "../DSL/Text/Text";
import TipTapEditor from "../TipTapEditor/TipTapEditor";
import { Buttons, CompetitionStoreProp } from "./CreateCompetition";

interface ReviewViewProps extends CompetitionStoreProp {}

const ReviewView = observer(({ store }: ReviewViewProps) => {
  return (
    <div className={css("flex", "flex-col", "gap-3")}>
      <Pane title={"Name"}>
        <Text>{store.name}</Text>
      </Pane>
      <Pane title={"Details"}>
        <div className={css("grid", "grid-cols-2")}>
          <Text type={TextType.Grey}>Ends At:</Text>
          <Text>{new Date(store.endsAt).toLocaleString()}</Text>
          <Text type={TextType.Grey}>Max User Submissions:</Text>
          <Text>{store.maxUserSubmissions}</Text>
        </div>
      </Pane>
      {store.coverImageFile && (
        <Pane title={"Cover"}>
          <div>
            <img
              src={URL.createObjectURL(store.coverImageFile)}
              className={css("mx-auto")}
            />
          </div>
        </Pane>
      )}
      {store.description && (
        <Pane title={"Description"}>
          {store.description && (
            <TipTapEditor
              readonly={true}
              content={store.description}
              border={false}
            />
          )}
        </Pane>
      )}
      {store.hasCurators && (
        <Pane title={"Curators"}>
          {store.curatorStore.curators.map((store) => (
            <div
              key={`curator-input-${store.address}`}
              className={css("flex", "items-center", "gap-2")}
            >
              <Link
                isExternal
                href={getEtherscanURL(store.address!, "address")}
              />
              <Text>{store.ens ? store.ens : abbreviate(store.address!)}</Text>
            </div>
          ))}
        </Pane>
      )}
      {store.hasVoters && (
        <Pane title={"Voters"}>
          {store.votersStore.votingRule.map((store) => (
            <div
              key={`voter-input-${store.contractAddress}-${store.tokenType}`}
              className={css("flex", "items-center", "justify-between")}
            >
              <div className={css("flex", "items-center", "gap-2")}>
                <Link
                  isExternal
                  href={getEtherscanURL(store.contractAddress!, "token")}
                />
                {store.name && <Text>{store.name}</Text>}
              </div>
              {store.holdersLength && (
                <Text type={TextType.Grey}>{store.holdersLength} holders</Text>
              )}
            </div>
          ))}
        </Pane>
      )}
      {store.hasRewards && (
        <Pane title={"Rewards"}>
          <div className={css("flex", "flex-col", "gap-1")}>
            {store.rewardStore.rewards.map((store, index) => (
              <div
                key={`reward-input-${store.contractAddress}`}
                className={css("flex", "items-center", "gap-2", "w-full")}
              >
                <Text>{index + 1}</Text>
                <RewardItem store={store} />
              </div>
            ))}
          </div>
        </Pane>
      )}
      <Form onSubmit={async () => store.onCompetitionSubmit()}>
        <Buttons
          store={store}
          submitLabel={"Submit"}
          isLoading={store.isLoading}
        />
      </Form>
    </div>
  );
});

const RewardItem = observer(({ store }: { store: RewardInputStore }) => {
  return (
    <div className={css("flex", "justify-between", "grow")}>
      <div className={css("flex", "items-center", "gap-2")}>
        <Link
          isExternal
          href={
            store.isNFT
              ? getOpenSeaURL(store.contractAddress!, store.tokenId!)
              : store.tokenType === TokenType.ETH
              ? getEtherscanURL(AppStore.auth.address!, "address")
              : getEtherscanURL(store.contractAddress!, "token")
          }
        />
        <Text>{store.name}</Text>
      </div>
      {!store.isNFT && <Text>{store.amount}</Text>}
      {store.isNFT && store.thumbnail && (
        <img width={40} src={store.thumbnail} />
      )}
    </div>
  );
});

export default ReviewView;
