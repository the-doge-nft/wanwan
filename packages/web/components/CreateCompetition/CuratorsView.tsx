import { observer } from "mobx-react-lite";
import { css } from "../../helpers/css";
import Button from "../DSL/Button/Button";
import Form from "../DSL/Form/Form";
import { FormDisplay } from "../DSL/Form/FormControl";
import TextInput from "../DSL/Form/TextInput";
import { isEthereumAddress, required } from "../DSL/Form/validation";
import { Buttons, CompetitionStoreProp } from "./CreateCompetition";

const CuratorsView = observer(({ store }: CompetitionStoreProp) => {
  return (
    <>
      <FormDisplay
        label={"Curators"}
        description={"Users who can remove memes from your competition"}
      />
      <div className={css()}>
        {store.isCuratorsVisible && (
          <Form onSubmit={async () => store.onCuratorsSubmit()}>
            {Array.from(Array(store.curatorCount)).map((_, index) => {
              const key = `${store.CREATOR_INPUT_PREFIX}-${index}`;
              return (
                <TextInput
                  block
                  key={key}
                  name={key}
                  label={`Curator ${index + 1}`}
                  validate={[required, isEthereumAddress]}
                  placeholder={"0x..."}
                />
              );
            })}
            <CuratorButtons store={store} />
            <Buttons store={store} />
          </Form>
        )}
      </div>
      {!store.isCuratorsVisible && (
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
        onClick={() => store.addCurator()}
        disabled={!store.canAddCurator}
      >
        + Curator
      </Button>
      {store.showRemoveCurator && (
        <Button block onClick={() => store.removeCurator()}>
          - Curator
        </Button>
      )}
    </div>
  );
});

export default CuratorsView;
