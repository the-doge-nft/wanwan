import { SubComponent } from "../../pages/components";
import AspectRatio from "./AspectRatio";

const AspectRatioDemo = () => {
  return (
    <SubComponent title="AspectRatio">
      <AspectRatio
        ratio={0.75}
        style={{
          maxWidth: "300px",
          backgroundImage:
            "url(https://c1.staticflickr.com/4/3896/14550191836_cc0675d906.jpg)",
          backgroundSize: "cover",
        }}
      />
    </SubComponent>
  );
};

export default AspectRatioDemo;
