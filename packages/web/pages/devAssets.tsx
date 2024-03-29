import { BigNumber } from "ethers";
import { observer } from "mobx-react-lite";
import { PropsWithChildren, useMemo } from "react";
import {
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import Button, {
  ButtonSize,
  ConnectButton,
  Submit,
} from "../components/DSL/Button/Button";
import Code from "../components/DSL/Code/Code";
import Form from "../components/DSL/Form/Form";
import NumberInput from "../components/DSL/Form/NumberInput";
import { minValue, required } from "../components/DSL/Form/validation";
import Pane from "../components/DSL/Pane/Pane";
import { successToast } from "../components/DSL/Toast/Toast";
import { css } from "../helpers/css";
import AppLayout from "../layouts/App.layout";
import erc1155Abi from "../services/abis/erc1155";
import erc20Abi from "../services/abis/erc20";
import erc721Abi from "../services/abis/erc721";
import AppStore from "../store/App.store";
import DevAssetsStore from "../store/DevAssets.store";

const ERC20_ADDRESS = "0xAdC213A6279AadFe5c7663DcBBFB827C652C4C63";
const ERC721_ADDRESS = "0x9D7aAf203F6231750b71172c70806039CDd433e3";
const ERC1155_ADDRESS = "0x40c7Fb9E00111daF6A2a70342D5E792222261a4F";

const DevAssets = observer(() => {
  const store = useMemo(() => new DevAssetsStore(), []);
  const { chain } = useNetwork();
  const isConnectedToDevNetwork = chain?.network === "goerli";
  return (
    <AppLayout>
      <div
        className={css(
          "grow",
          "flex",
          "flex-col",
          "items-center",
          "justify-center"
        )}
      >
        {isConnectedToDevNetwork && (
          <div>
            {!AppStore.auth.isAuthed && (
              <div>
                <ConnectButton size={ButtonSize.lg} />
              </div>
            )}
            {AppStore.auth.isAuthed && (
              <div className={css("flex", "flex-col", "gap-8")}>
                <ERC20Form store={store} />
                <ERC721Form store={store} />
                <ERC1155Form store={store} />
              </div>
            )}
          </div>
        )}
        {!isConnectedToDevNetwork && <div>Not connected to dev network</div>}
      </div>
    </AppLayout>
  );
});

interface DevAssetsFormProps {
  store: DevAssetsStore;
}

const ERC20Form: React.FC<DevAssetsFormProps> = observer(({ store }) => {
  const { config } = usePrepareContractWrite({
    address: ERC20_ADDRESS,
    abi: erc20Abi,
    functionName: "get",
    args: [
      store.erc20Amount !== ""
        ? BigNumber.from(store.erc20Amount).mul(BigNumber.from(10).pow(18))
        : "",
    ],
  });
  const { data: contractData, isLoading, write } = useContractWrite(config);
  const { isLoading: isTxLoading } = useWaitForTransaction({
    hash: contractData?.hash,
    onSuccess: () => {
      successToast("erc20 minted");
    },
  });
  return (
    <Pane title={"MockERC20"}>
      <ContractAddress>{ERC20_ADDRESS}</ContractAddress>
      <Form onSubmit={async () => write && write()}>
        <div className={css("flex", "flex-col", "gap-2")}>
          <NumberInput
            label={"Amount"}
            name={"amount"}
            validate={[required, minValue(1)]}
            value={store.erc20Amount}
            onChange={(value) => (store.erc20Amount = value)}
            block
          />
          <Submit block isLoading={isLoading || isTxLoading}>
            Mint
          </Submit>
        </div>
      </Form>
    </Pane>
  );
});

const ERC721Form: React.FC<DevAssetsFormProps> = observer(({ store }) => {
  const { config } = usePrepareContractWrite({
    address: ERC721_ADDRESS,
    abi: erc721Abi,
    functionName: "mint",
  });
  const { data: contractData, isLoading, write } = useContractWrite(config);
  const { isLoading: isTxLoading } = useWaitForTransaction({
    hash: contractData?.hash,
    onSuccess: () => {
      successToast("erc721 minted");
    },
  });
  return (
    <Pane title={"MockERC721"}>
      <ContractAddress>{ERC721_ADDRESS}</ContractAddress>
      <div className={css("flex", "flex-col", "gap-2")}>
        <Button
          onClick={() => write && write()}
          isLoading={isLoading || isTxLoading}
        >
          Mint
        </Button>
      </div>
    </Pane>
  );
});

const ERC1155Form: React.FC<DevAssetsFormProps> = observer(({ store }) => {
  const { config } = usePrepareContractWrite({
    address: ERC1155_ADDRESS,
    abi: erc1155Abi,
    functionName: "mint",
    args: [store.erc1155TokenId, store.erc1155Amount],
  });

  const { data: contractData, isLoading, write } = useContractWrite(config);
  const { isLoading: isTxLoading } = useWaitForTransaction({
    hash: contractData?.hash,
    onSuccess: () => {
      successToast("erc1155 minted");
    },
  });

  const { data } = useContractRead({
    address: ERC1155_ADDRESS,
    abi: erc1155Abi,
    functionName: "uri",
    args: [store.erc1155TokenId],
  });

  return (
    <Pane title={"MockERC1155"}>
      <ContractAddress>{ERC1155_ADDRESS}</ContractAddress>
      <div className={css("flex", "justify-center", "mb-4", "mt-2")}>
        <div
          style={{ backgroundImage: `url(${data})` }}
          className={css(
            "w-[100px]",
            "h-[100px]",
            "bg-cover",
            "bg-no-repeat",
            "bg-slate-200",
            "border-[1px]",
            "border-solid",
            "border-black",
            "dark:border-neutral-300"
          )}
        />
      </div>
      <Form onSubmit={async () => write && write()}>
        <div className={css("flex", "flex-col", "gap-2")}>
          <div className={css("flex-col", "md:flex-row", "flex", "gap-2")}>
            <NumberInput
              label={"Token ID"}
              name={"tokenID"}
              block
              validate={required}
              value={store.erc1155TokenId}
              onChange={(value) => (store.erc1155TokenId = value)}
            />
            <NumberInput
              label={"Amount"}
              name={"amount"}
              block
              validate={required}
              value={store.erc1155Amount}
              onChange={(value) => (store.erc1155Amount = value)}
            />
          </div>
          <Submit block isLoading={isLoading || isTxLoading}>
            Mint
          </Submit>
        </div>
      </Form>
    </Pane>
  );
});

const ContractAddress: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Code
      className={css(
        "bg-slate-100",
        "p-0.5",
        "border-[1px]",
        "border-dashed",
        "border-black",
        "dark:border-neutral-300",
        "dark:bg-neutral-800",
        "mb-2",
        "w-full"
      )}
    >
      {children}
    </Code>
  );
};

export default DevAssets;
