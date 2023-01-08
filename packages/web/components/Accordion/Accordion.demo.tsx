import { css } from "../../helpers/css";
import { SubComponent } from "../../pages/components";
import Accordion from "./Accordion";

const AccordionDemo = () => {
  return (
    <SubComponent title={"Accordion"}>
      <Accordion>
        <Accordion.Item value={"test1"} trigger={"peak"}>
          <div className={css("text-sm")}>aboo</div>
        </Accordion.Item>
        <Accordion.Item value={"test2"} trigger={"👈"}>
          <div className={css("text-sm")}>👉</div>
        </Accordion.Item>
      </Accordion>
    </SubComponent>
  );
};

export default AccordionDemo;
