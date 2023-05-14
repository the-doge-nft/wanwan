import { observer } from "mobx-react-lite";
import { useCallback, useMemo } from "react";
import { css } from "../../helpers/css";
import { abbreviate, getLooksRareCollectionURL } from "../../helpers/strings";
import {
  CompetitionVoteReason,
  Currency,
  CurrencyType,
} from "../../interfaces";
import Link from "../DSL/Link/Link";
import Modal from "../DSL/Modal/Modal";
import Text, { TextSize, TextType } from "../DSL/Text/Text";

interface InvalidVoteReasonModalProps {
  reason: Array<CompetitionVoteReason>;
  isOpen: boolean;
  onChange: (isOpen: boolean) => void;
}

const InvalidVoteReasonModal = observer(
  ({ reason, isOpen, onChange }: InvalidVoteReasonModalProps) => {
    const currencies = useMemo(
      () => reason.map((res) => res.currency),
      [reason]
    );
    return (
      <Modal
        title={"You can't vote"}
        isOpen={isOpen}
        onChange={(isOpen) => onChange(isOpen)}
      >
        <div className={css("text-center")}>
          <Text bold size={TextSize.sm}>
            You must be holding any of the following to be able to vote
          </Text>
        </div>
        <div className={css("mt-2", "flex", "flex-col", "gap-1")}>
          {currencies.map((currency) => (
            <CurrencyItem
              key={`invalid-vote-reason-${currency.name}`}
              currency={currency}
            />
          ))}
        </div>
      </Modal>
    );
  }
);

interface CurrencyItemProps {
  currency: Currency;
}

const CurrencyItem = ({ currency }: CurrencyItemProps) => {
  const renderLink = useCallback(() => {
    let link;
    if (currency.type === CurrencyType.ERC20) {
      link = "";
    } else if (currency.type === CurrencyType.ETH) {
      link = "";
    } else {
      link = getLooksRareCollectionURL(currency.contractAddress);
    }
    return <Link isExternal href={link} />;
  }, [currency]);

  return (
    <div
      className={css("p-1", "flex", "items-center", "gap-2", "justify-between")}
    >
      <div className={css("flex", "items-center", "gap-2")}>
        {renderLink()}
        <Text>
          {currency.type === CurrencyType.ETH
            ? "Ethereum"
            : currency.name || abbreviate(currency.contractAddress)}
        </Text>
      </div>

      <Text type={TextType.Grey} size={TextSize.xs}>
        {currency.type}
      </Text>
    </div>
  );
};

export default InvalidVoteReasonModal;
