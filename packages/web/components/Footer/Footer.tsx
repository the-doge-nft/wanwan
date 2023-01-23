import { css } from "../../helpers/css";

const Footer = () => {
  return (
    <footer
      className={css(
        "text-xs",
        "text-slate-400",
        "dark:text-neutral-600",
        "text-center",
        "mt-10"
      )}
    >
      No copyright, no trademark. Kabosu forever.
    </footer>
  );
};
export default Footer;
