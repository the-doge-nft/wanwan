import { useState } from "react";
import { css } from "../../helpers/css";
import { SubComponent, Variant } from "../../pages/components";
import Code from "../Code/Code";
import Input from "./Input";

const InputDemo = () => {
  const [text, setText] = useState<string>("");
  const [textArea, setTextArea] = useState<string>("");
  const [number, setNumber] = useState<string>("");
  return (
    <SubComponent title={"Input"}>
      <Variant title={"Text"}>
        <div className={css("flex", "justify-between", "px-4")}>
          <Variant title={"Uncontrolled"}>
            <Input defaultValue={"yeet"} />
          </Variant>
          <Variant title={"Controlled"} className={css("flex", "flex-col")}>
            <Input value={text} onChange={setText} />
            <Code className={css("max-w-xxs", "text-xs")}>{text}</Code>
          </Variant>
        </div>
      </Variant>
      <Variant title={"Text Area"} className={css("mt-2")}>
        <div className={css("flex", "justify-between", "px-4")}>
          <Variant title={"Uncontrolled"}>
            <Input type={"textarea"} defaultValue={"yeet"} />
          </Variant>
          <Variant title={"Controlled"} className={css("flex", "flex-col")}>
            <Input type={"textarea"} value={textArea} onChange={setTextArea} />
            <Code className={css("max-w-xxs", "text-xs")}>{textArea}</Code>
          </Variant>
        </div>
      </Variant>
      <Variant title={"Number"} className={css("mt-2")}>
        <div className={css("flex", "justify-between", "px-4")}>
          <Variant title={"Uncontrolled"}>
            <Input type={"number"} defaultValue={"0"} />
          </Variant>
          <Variant title={"Controlled"} className={css("flex", "flex-col")}>
            <Input type={"number"} value={number} onChange={setNumber} />
            <Code className={css("max-w-xxs", "text-xs")}>{number}</Code>
          </Variant>
        </div>
      </Variant>
    </SubComponent>
  );
};

export default InputDemo;
