import { useState } from "react";
import { css } from "../../helpers/css";
import { jsonify } from "../../helpers/strings";
import { SubComponent, Variant } from "../../pages/components";
import Button from "../Button/Button";
import Code from "../Code/Code";
import Form from "./Form";
import NumberInput from "./NumberInput";
import TextInput from "./TextInput";

const FormDemo = () => {
  const [textInput, setTextInput] = useState("");
  return (
    <SubComponent title={"Form"}>
      <div className={css("flex", "justify-between")}>
        <div className={css("grow", "shrink-0", "flex", "justify-center")}>
          <Variant title={"Uncontrolled"}>
            <Form onSubmit={async (values) => alert(jsonify(values))}>
              <TextInput
                name={"text"}
                defaultValue={"test"}
                label={"<text label>"}
              />
              <NumberInput
                name={"number"}
                label={"<number label>"}
                description={"description"}
              />
              <div className={css("flex", "justify-center", "mt-4")}>
                <Button submit>submit</Button>
              </div>
            </Form>
          </Variant>
        </div>
        <div className={css("grow", "shrink-0", "flex", "justify-center")}>
          <Variant title={"Controlled"}>
            <Form onSubmit={async (values) => alert(jsonify(values))}>
              <TextInput
                name={"textInput"}
                value={textInput}
                onChange={setTextInput}
              />
              <div className={css("flex", "justify-center", "mt-4")}>
                <Button submit>submit</Button>
              </div>
            </Form>
            <Code className={css()}>{jsonify({ textInput })}</Code>
          </Variant>
        </div>
      </div>
    </SubComponent>
  );
};
export default FormDemo;
