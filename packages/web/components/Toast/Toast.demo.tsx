import { css } from "../../helpers/css";
import { SubComponent, Variant } from "../../pages/components";
import Button from "../Button/Button";
import { debugToast, errorToast, successToast, warningToast } from "./Toast";

const ToastDemo = () => {
  return (
    <SubComponent title={"Toast"}>
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
    </SubComponent>
  );
};

export default ToastDemo;
