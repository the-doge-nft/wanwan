import { Demo } from "../Demo";
import Text from "../Text/Text";
import Accordion from "./Accordion";

const AccordionDemo = () => {
  return (
    <Demo title={"Accordion"}>
      <Accordion>
        <Accordion.Item value={"test1"} trigger={<Text>peak</Text>}>
          <Text>aboo</Text>
        </Accordion.Item>
        <Accordion.Item value={"test2"} trigger={<Text>🫡</Text>}>
          <Text>🤫</Text>
        </Accordion.Item>
      </Accordion>
    </Demo>
  );
};

export default AccordionDemo;
