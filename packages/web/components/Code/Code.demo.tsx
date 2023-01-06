import { SubComponent } from "../../pages/components";
import Code from "./Code";

const CodeDemo = () => {
  return (
    <SubComponent title={"Code"}>
      <Code>
        {JSON.stringify({
          media: { url: "https://here.com" },
          name: "mank",
          width: 100,
          height: 150,
          votes: [
            {
              score: 1,
              address: "0xd801d86C10e2185a8FCBccFB7D7baF0A6C5B6BD5",
            },
          ],
        })}
      </Code>
    </SubComponent>
  );
};

export default CodeDemo;
