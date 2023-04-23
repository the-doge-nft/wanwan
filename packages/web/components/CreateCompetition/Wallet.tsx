import { jsonify } from "../../helpers/strings";
import { Wallet } from "../../interfaces";

interface WalletProps {
  wallet: Wallet;
}

const WalletView = ({ wallet }: WalletProps) => {
  return <div>{jsonify(wallet)}</div>;
};

export default WalletView;
