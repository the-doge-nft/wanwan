import { css } from "../../../helpers/css";
import Button from "../Button/Button";
import { Demo } from "../Demo";
import { Variant } from "../Variant";
import { debugToast, errorToast, successToast, warningToast } from "./Toast";

const ToastDemo = () => {
  return (
    <Demo title={"Toast"}>
      <div className={css("flex", "justify-between")}>
        <Variant title={"Success"}>
          <Button onClick={() => successToast("Success")}>Success</Button>
        </Variant>
        <Variant title={"Error"}>
          <Button onClick={() => errorToast("Error")}>Error</Button>
        </Variant>
        <Variant title={"Warning"}>
          <Button onClick={() => warningToast("Warning")}>Warning</Button>
        </Variant>
        <Variant title={"Debug"}>
          <Button onClick={() => debugToast("Debug")}>Debug</Button>
        </Variant>
      </div>
    </Demo>
  );
};

export default ToastDemo;
