import { css } from "../../../helpers/css";
import { Demo } from "../Demo";
import { Variant } from "../Variant";
import AspectRatio from "./AspectRatio";

const AspectRatioDemo = () => {
  return (
    <Demo title="AspectRatio">
      <div className={css("flex")}>
        <Variant title={"3:4"} className={css("grow")}>
          <AspectRatio
            ratio={0.75}
            style={{
              backgroundImage:
                "url(https://c1.staticflickr.com/4/3896/14550191836_cc0675d906.jpg)",
            }}
            className={css("max-w-[300px]", "bg-cover", "bg-no-repeat")}
          />
        </Variant>
        <Variant title={"0.826:1"} className={css("grow")}>
          <AspectRatio
            ratio={0.75}
            className={css("max-w-[300px]", "bg-cover", "bg-no-repeat")}
            style={{
              backgroundImage:
                "url(https://www.illumination.com/wp-content/uploads/2020/02/YoungGru.png)",
            }}
          />
        </Variant>
      </div>
    </Demo>
  );
};

export default AspectRatioDemo;
