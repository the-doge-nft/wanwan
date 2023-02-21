import { css } from "../../helpers/css";
import { Divider } from "../DSL/Divider/Divider";
import Text, { TextSize, TextType } from "../DSL/Text/Text";

const Footer = () => {
  return (
    <footer className={css("mt-10", "text-center")}>
      <Divider />
      <Text type={TextType.Grey} size={TextSize.xs}>
        Built for and by meme lovers
      </Text>
    </footer>
  );
};
export default Footer;
