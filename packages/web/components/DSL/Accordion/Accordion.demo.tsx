import { css } from "../../../helpers/css";
import { Demo } from "../Demo";
import Accordion from "./Accordion";

const AccordionDemo = () => {
  return (
    <Demo title={"Accordion"}>
      <Accordion>
        <Accordion.Item value={"test1"} trigger={"peak"}>
          <div className={css("text-sm")}>aboo</div>
        </Accordion.Item>
        <Accordion.Item value={"test2"} trigger={"👈"}>
          <div className={css("text-sm")}>👉</div>
        </Accordion.Item>
      </Accordion>
    </Demo>
  );
};

export default AccordionDemo;
