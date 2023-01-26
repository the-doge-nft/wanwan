import { css } from "../../helpers/css";
import Text, { TextSize, TextType } from "../DSL/Text/Text";

const Footer = () => {
  return (
    <footer className={css("text-center", "mt-10")}>
      <Text type={TextType.Grey} size={TextSize.xs}>
        No copyright, no trademark. Kabosu forever.
      </Text>
    </footer>
  );
};
export default Footer;
