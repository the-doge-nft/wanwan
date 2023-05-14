import { observer } from "mobx-react-lite";
import { useFormState } from "react-final-form";
import { IoCloseOutline } from "react-icons/io5";
import { objectKeys } from "../../helpers/arrays";
import { css } from "../../helpers/css";
import { abbreviate, getEtherscanURL } from "../../helpers/strings";
import AppStore from "../../store/App.store";
import Button from "../DSL/Button/Button";
import Form from "../DSL/Form/Form";
import { FormDisplay } from "../DSL/Form/FormControl";
import TextInput from "../DSL/Form/TextInput";
import { isEthereumAddressOrEns, required } from "../DSL/Form/validation";
import Link from "../DSL/Link/Link";
import Spinner, { SpinnerSize } from "../DSL/Spinner/Spinner";
import Text, { TextSize, TextType } from "../DSL/Text/Text";
import { Buttons, CompetitionStoreProp } from "./CreateCompetition";
import Detail from "./Detail";

const CuratorsView = observer(({ store }: CompetitionStoreProp) => {
  return (
    <>
      <FormDisplay
        label={"Curators"}
        description={"Who can remove memes from your competition?"}
      />
      <div className={css("mt-2")}>
        {!store.curatorStore.isCuratorsVisible && (
          <Detail>
            Only you: <Text bold>{AppStore.auth.displayName}</Text> will be able
            to remove submissions
          </Detail>
        )}
        {store.curatorStore.isCuratorsVisible && (
          <Form onSubmit={async () => store.onCuratorsSubmit()}>
            <div className={css("flex", "flex-col", "gap-3", "mt-1")}>
              {store.curatorStore.curators.map((curatorStore, index) => {
                return (
                  <TextInput
                    block
                    key={`curator-input-${index}`}
                    name={`curator-input-${index}`}
                    label={
                      <div
                        className={css(
                          "flex",
                          "gap-1",
                          "justify-between",
                          "w-full",
                          "items-baseline"
                        )}
                      >
                        <Text>{index + 1}</Text>
                        {curatorStore.isLoading && (
                          <Spinner size={SpinnerSize.xs} />
                        )}
                        {curatorStore.address && (
                          <Link
                            isExternal
                            href={getEtherscanURL(
                              curatorStore.address,
                              "address"
                            )}
                          >
                            <Text type={TextType.NoColor} size={TextSize.xs}>
                              ({abbreviate(curatorStore.address)})
                            </Text>
                          </Link>
                        )}
                        {curatorStore.ens && (
                          <Link
                            isExternal
                            href={getEtherscanURL(curatorStore.ens, "address")}
                          >
                            <Text type={TextType.NoColor} size={TextSize.xs}>
                              {curatorStore.ens}
                            </Text>
                          </Link>
                        )}
                      </div>
                    }
                    validate={[required, isEthereumAddressOrEns]}
                    value={curatorStore.search}
                    onChange={(value) => (curatorStore.search = value)}
                    placeholder={"address or ens"}
                    leftOfInput={
                      <div className={css("flex", "items-center")}>
                        <Button
                          onClick={() =>
                            store.curatorStore.removeCurator(index)
                          }
                        >
                          <IoCloseOutline size={12} />
                        </Button>
                      </div>
                    }
                  />
                );
              })}
            </div>
            <AddCuratorButton store={store} />
            <Buttons store={store} />
          </Form>
        )}
      </div>
      {!store.curatorStore.isCuratorsVisible && (
        <Form onSubmit={async () => store.onCuratorsSubmit()}>
          <AddCuratorButton store={store} />
          <Buttons store={store} />
        </Form>
      )}
    </>
  );
});

const AddCuratorButton = observer(({ store }: CompetitionStoreProp) => {
  const state = useFormState();
  return (
    <div className={css("flex", "items-center", "gap-2", "mt-2")}>
      {store.curatorStore.canAdd && (
        <Button
          block
          onClick={() => store.curatorStore.addCurator()}
          disabled={
            !store.curatorStore.canAdd || objectKeys(state.errors).length > 0
          }
        >
          + Curator
        </Button>
      )}
    </div>
  );
});

export default CuratorsView;
