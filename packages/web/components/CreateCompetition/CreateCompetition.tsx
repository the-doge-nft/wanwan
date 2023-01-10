import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import CreateCompetitionStore from "../../store/CreateCompetition.store";
import Form from "../DSL/Form/Form";

const CreateCompetition = observer(() => {
  const store = useMemo(() => new CreateCompetitionStore(), []);
  return <Form onSubmit={(values) => store.onCompetitionSubmit(values)}></Form>;
});

export default CreateCompetition;
