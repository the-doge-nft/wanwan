import { Nft } from "alchemy-sdk";
import { action, computed, makeObservable, observable } from "mobx";
import { formatWithThousandsSeparators } from "../../helpers/numberFormatter";
import { abbreviate, isValidEthereumAddress } from "../../helpers/strings";
import { Nullable, TokenType } from "../../interfaces";
import Http from "../../services/http";
import { EmptyClass } from "../../services/mixins";
import { Reactionable } from "../../services/mixins/reactionable";

export enum VoteInputView {
  Choose = "choose",
  Wallet = "wallet",
  Manual = "manual",
}

export default class VoteInputStore extends Reactionable(EmptyClass) {
  @observable
  tokenType = TokenType.ERC721;

  @observable
  view: VoteInputView = VoteInputView.Choose;

  @observable
  contractAddress: Nullable<string> = null;

  @observable
  holdersLength?: number = undefined;

  @observable
  nfts: Nft[] = [];

  @observable
  name?: Nullable<string> = undefined;

  @observable
  isLoadingHolders = false;

  @observable
  isLoadingNfts = false;

  @observable
  isConfirmed = false;

  @observable
  manualTokenAddress = "";

  @observable
  isManualTokenValid = false;

  constructor() {
    super();
    makeObservable(this);
    this.react(
      () => this.manualTokenAddress,
      (address) => {
        if (isValidEthereumAddress(address)) {
          Http.getTokenType(address)
            .then(({ data }) => {
              this.isManualTokenValid = true;
              this.contractAddress = address;
              if (data.tokenType === TokenType.ERC721) {
                this.tokenType = TokenType.ERC721;
              } else if (data.tokenType === TokenType.ERC1155) {
                this.tokenType = TokenType.ERC1155;
              } else {
                this.tokenType = TokenType.ERC20;
              }
            })
            .catch((e) => {
              this.isManualTokenValid = false;
            });
        } else {
          this.isManualTokenValid = false;
          this.contractAddress = null;
        }
      }
    );
  }

  @action
  setInput(
    address: string | null,
    tokenType: TokenType,
    name?: Nullable<string>
  ) {
    this.contractAddress = address;
    this.tokenType = tokenType;
    if (name) {
      this.name = name;
    } else {
      if (this.contractAddress) {
        this.name = abbreviate(this.contractAddress);
      }
    }
    if (this.contractAddress !== "eth") {
      this.getHolders();
      this.getNfts();
    }
  }

  @action
  getHolders() {
    this.isLoadingHolders = true;
    return Http.getNftContractHolders(this.contractAddress!)
      .then(({ data }) => (this.holdersLength = data.owners.length))
      .finally(() => (this.isLoadingHolders = false));
  }

  @action
  getNfts() {
    this.isLoadingNfts = true;
    return Http.getNftsForContract(this.contractAddress!)
      .then(({ data }) => {
        this.nfts = data.nfts.filter((nft) => !!nft?.media[0]?.thumbnail);
      })
      .finally(() => (this.isLoadingNfts = false));
  }

  @computed
  get holderLengthTitle() {
    if (this.holdersLength === 50000) {
      return "50,000+";
    } else {
      return formatWithThousandsSeparators(this.holdersLength ?? 0);
    }
  }
}
