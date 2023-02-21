import { useState } from "react";
import { Demo } from "../Demo";
import Select from "./Select";

const SelectDemo = () => {
  const [value, setValue] = useState<string | undefined>();
  return (
    <Demo title={"Select"}>
      <Select
        defaultValue="test"
        onChange={(val) => setValue(val)}
        value={value}
        items={[
          { id: "test", name: "test" },
          { name: "empty", id: "empty" },
        ]}
      />
    </Demo>
  );
};

export default SelectDemo;
