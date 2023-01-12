import { useState } from "react";
import { css } from "../../../helpers/css";
import { jsonify } from "../../../helpers/strings";
import Button from "../Button/Button";
import { Demo } from "../Demo";
import { Variant } from "../Variant";
import DateInput from "./DateInput";
import Form from "./Form";
import MediaInput from "./MediaInput";
import NumberInput from "./NumberInput";
import SelectInput from "./SelectInput";
import TextInput from "./TextInput";
import { required } from "./validation";

const FormDemo = () => {
  const [textInput, setTextInput] = useState("");
  const [dateInput, setDateInput] = useState(new Date());
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
                  acceptedMimeToExtension={{ "image/jpg": [".jpg", ".jpeg"] }}
                />
                <DateInput name={"date"} label={"<date>"} validate={required} />
                <SelectInput
                  label={"<select>"}
                  name={"select"}
                  items={[{ id: "test", name: "test" }]}
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
                label={"<text>"}
                name={"textInput"}
                value={textInput}
                onChange={setTextInput}
              />
              <DateInput
                name={"date"}
                label={"<date>"}
                value={dateInput.toString()}
                onChange={setDateInput}
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
