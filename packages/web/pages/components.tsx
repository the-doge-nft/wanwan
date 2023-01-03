import { PropsWithChildren } from "react";
import Button from "../components/Button/Button";
import { css } from "../helpers/css";
import AppLayout from "../layouts/App.layout";

const SubComponent: React.FC<PropsWithChildren<{ title?: string }>> = ({
  children,
  title,
}) => {
  return (
    <div
      className={css("border-[1px]", "border-black", "p-2", "bg-indigo-200")}
    >
      {title && <div className={css("text-sm", "italic", "mb-1")}>{title}</div>}
      <div>{children}</div>
    </div>
  );
};

const Components = () => {
  return (
    <AppLayout>
      <SubComponent title={"Button"}>
        <Button onClick={() => alert("Check it out")}>Submit</Button>
      </SubComponent>
    </AppLayout>
  );
};

export default Components;
