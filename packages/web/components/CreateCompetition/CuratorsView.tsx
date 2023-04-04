import { observer } from "mobx-react-lite";
import { css } from "../../helpers/css";
import { abbreviate, getEtherscanURL } from "../../helpers/strings";
import Button from "../DSL/Button/Button";
import Form from "../DSL/Form/Form";
import { FormDisplay } from "../DSL/Form/FormControl";
import TextInput from "../DSL/Form/TextInput";
import { isEthereumAddressOrEns, required } from "../DSL/Form/validation";
import Link from "../DSL/Link/Link";
import Spinner, { SpinnerSize } from "../DSL/Spinner/Spinner";
import Text, { TextSize, TextType } from "../DSL/Text/Text";
import { Buttons, CompetitionStoreProp } from "./CreateCompetition";

const CuratorsView = observer(({ store }: CompetitionStoreProp) => {
  return (
    <>
      <FormDisplay
        label={"Curators"}
        description={"Users who can remove memes from your competition"}
      />
      <div className={css()}>
        {store.curators.isCuratorsVisible && (
          <Form onSubmit={async () => store.onCuratorsSubmit()}>
            <div className={css("flex", "flex-col", "gap-3", "mt-1")}>
              {Array.from(Array(store.curators.count)).map((_, index) => {
                const key = store.curators.getKey(index);
                return (
                  <TextInput
                    block
                    key={key}
                    name={key}
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
                        <Text>Curator {index + 1}</Text>
                        {store.curators.curators[key].isLoading && (
                          <Spinner size={SpinnerSize.xs} />
                        )}
                        {store.curators.curators[key].address && (
                          <Link
                            isExternal
                            href={getEtherscanURL(
                              store.curators.curators[key].address as string,
                              "address"
                            )}
                          >
                            <Text type={TextType.NoColor} size={TextSize.xs}>
                              (
                              {abbreviate(
                                store.curators.curators[key].address as string
                              )}
                              )
                            </Text>
                          </Link>
                        )}
                        {store.curators.curators[key].ens && (
                          <Link
                            isExternal
                            href={getEtherscanURL(
                              store.curators.curators[key].ens as string,
                              "address"
                            )}
                          >
                            <Text type={TextType.NoColor} size={TextSize.xs}>
                              {store.curators.curators[key].ens as string}
                            </Text>
                          </Link>
                        )}
                      </div>
                    }
                    validate={[required, isEthereumAddressOrEns]}
                    value={store.curators.curators[key].search}
                    onChange={(value) =>
                      (store.curators.curators[key].search = value)
                    }
                    placeholder={"address or ens"}
                  />
                );
              })}
            </div>
            <CuratorButtons store={store} />
            <Buttons store={store} />
          </Form>
        )}
      </div>
      {!store.curators.isCuratorsVisible && (
        <Form onSubmit={async () => store.onCuratorsSubmit()}>
          <CuratorButtons store={store} />
          <Buttons store={store} />
        </Form>
      )}
    </>
  );
});

const CuratorButtons = observer(({ store }: CompetitionStoreProp) => {
  return (
    <div className={css("flex", "items-center", "gap-2", "mt-2")}>
      <Button
        block
        onClick={() => store.curators.add()}
        disabled={!store.curators.canAdd}
      >
        + Curator
      </Button>
      {store.curators.canRemove && (
        <Button block onClick={() => store.curators.remove()}>
          - Curator
        </Button>
      )}
    </div>
  );
});

export default CuratorsView;
