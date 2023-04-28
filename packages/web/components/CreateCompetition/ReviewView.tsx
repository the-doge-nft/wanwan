import { observer } from "mobx-react-lite";
import { css } from "../../helpers/css";
import { abbreviate, getEtherscanURL } from "../../helpers/strings";
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
        <Pane title={"Cover Image"}>
          <img src={URL.createObjectURL(store.coverImageFile)} />
        </Pane>
      )}
      {store.description && (
        <Pane title={"Description"}>
          {store.description && (
            <TipTapEditor readonly={true} content={store.description} />
          )}
        </Pane>
      )}
      {store.hasVoters && (
        <Pane title={"Vote Rules"}>
          {store.votersStore.votingRule.map((store) => (
            <div
              key={`voter-input-${store.contractAddress}-${store.tokenType}`}
            >
              <Link
                isExternal
                href={getEtherscanURL(store.contractAddress!, "token")}
              >
                {abbreviate(store.contractAddress!)}
              </Link>
            </div>
          ))}
        </Pane>
      )}
      {store.hasCurators && (
        <Pane title={"Curators"}>
          {store.curatorStore.curators.map((store) => (
            <div key={`curator-input-${store.address}`}>
              <Link
                isExternal
                href={getEtherscanURL(store.address!, "address")}
              >
                {abbreviate(store.address!)}
              </Link>
            </div>
          ))}
        </Pane>
      )}
      {store.hasRewards && (
        <Pane title={"Rewards"}>
          {store.rewardStore.rewards.map((store) => (
            <RewardItem
              store={store}
              key={`reward-input-${store.contractAddress}`}
            />
          ))}
        </Pane>
      )}

      <Form onSubmit={async () => {}}>
        <Buttons store={store} />
      </Form>
    </div>
  );
});

const RewardItem = ({ store }: any) => {
  return (
    <div>
      <Link isExternal href={getEtherscanURL(store.contractAddress!, "token")}>
        {abbreviate(store.contractAddress!)}
      </Link>
      {store.isNFT && <img src={store.selectedNft?.media?.[0]?.thumbnail} />}
    </div>
  );
};

export default ReviewView;
