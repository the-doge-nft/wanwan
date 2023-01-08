import { Demo } from "../Demo";
import Code from "./Code";

const CodeDemo = () => {
  return (
    <Demo title={"Code"}>
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
    </Demo>
  );
};

export default CodeDemo;
