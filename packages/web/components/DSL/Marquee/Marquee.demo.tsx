import { css } from "../../../helpers/css";
import { Demo } from "../Demo";
import Marquee from "./Marquee";

const MarqueeDemo = () => {
  return (
    <Demo title={"Marquee"}>
      <Marquee>
        {new Array(10).fill(undefined).map((item, index) => (
          <div key={`marque-demo-${index}`} className={css("mr-2")}>
            memes
          </div>
        ))}
      </Marquee>
    </Demo>
  );
};

export default MarqueeDemo;
