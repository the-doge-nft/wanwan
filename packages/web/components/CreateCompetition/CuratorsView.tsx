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
        {store.curators.isCuratorsVisible && (
          <Form onSubmit={async () => store.onCuratorsSubmit()}>
            {Array.from(Array(store.curators.count)).map((_, index) => {
              const key = store.curators.getKey(index);
              return (
                <TextInput
                  block
                  key={key}
                  name={key}
                  label={`Curator ${index + 1}`}
                  validate={[required, isEthereumAddress]}
                  placeholder={"address or ens"}
                />
              );
            })}
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
