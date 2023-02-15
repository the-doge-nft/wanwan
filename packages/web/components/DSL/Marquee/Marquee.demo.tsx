import { Demo } from "../Demo";
import Text from "../Text/Text";
import Marquee from "./Marquee";

const MarqueeDemo = () => {
  return (
    <Demo title={"Marquee"}>
      <Marquee>
        {new Array(10).fill(undefined).map((item, index) => (
          <Text key={`marque-demo-${index}`}>memes</Text>
        ))}
      </Marquee>
    </Demo>
  );
};

export default MarqueeDemo;
