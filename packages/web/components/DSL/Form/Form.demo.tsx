import { useState } from "react";
import { css } from "../../../helpers/css";
import { jsonify } from "../../../helpers/strings";
import Button from "../Button/Button";
import { Demo } from "../Demo";
import { Variant } from "../Variant";
import Form from "./Form";
import MediaInput from "./MediaInput";
import NumberInput from "./NumberInput";
import TextInput from "./TextInput";
import { required } from "./validation";

const FormDemo = () => {
  const [textInput, setTextInput] = useState("");
  return (
    <Demo title={"Form"}>
      <div className={css("flex", "justify-between")}>
        <div className={css("grow", "shrink-0", "flex", "justify-center")}>
          <Variant title={"Uncontrolled"}>
            <Form onSubmit={async (values) => alert(jsonify(values))}>
              <div className={css("flex", "flex-col", "gap-2")}>
                <TextInput
                  validate={required}
                  name={"text"}
                  defaultValue={"test"}
                  label={"<text>"}
                />
                <NumberInput
                  validate={required}
                  name={"number"}
                  label={"<number>"}
                />
                <MediaInput
                  label={"<media>"}
                  name={"media"}
                  onDropAccepted={() => {}}
                  validate={required}
                  maxSizeBytes={1000000}
                  acceptedMimeToExtension={{ "image/jpg": [".jpg"] }}
                />
                <div className={css("flex", "justify-center", "mt-4")}>
                  <Button submit>submit</Button>
                </div>
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
          </Variant>
        </div>
      </div>
    </Demo>
  );
};
export default FormDemo;
