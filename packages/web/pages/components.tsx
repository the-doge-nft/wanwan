import { PropsWithChildren } from "react";
import Button from "../components/Button/Button";
import Pane, { PaneType } from "../components/Pane/Pane";
import { css } from "../helpers/css";
import AppLayout from "../layouts/App.layout";

const SubComponent: React.FC<PropsWithChildren<{ title?: string }>> = ({
  children,
  title,
}) => {
  return (
    <div className={css("border-[1px]", "border-black", "p-2", "bg-gray-100")}>
      {title && <div className={css("text-sm", "italic", "mb-1")}>{title}</div>}
      <div>{children}</div>
    </div>
  );
};

const Variant: React.FC<PropsWithChildren<{ title: string }>> = ({
  title,
  children,
}) => {
  return (
    <div>
      <div className={css("text-xs", "text-gray-600", "mb-1")}>v: {title}</div>
      {children}
    </div>
  );
};

const Components = () => {
  return (
    <AppLayout>
      <div className={css("flex", "flex-col", "gap-5")}>
        <SubComponent title={"Button"}>
          <Variant title={"Primary"}>
            <Button onClick={() => alert("Check it out")}>Click me</Button>
          </Variant>
        </SubComponent>
        <SubComponent title={"Pane"}>
          <div className={css("flex", "flex-col", "gap-2")}>
            <Variant title={"Primary"}>
              <Pane title={"What is meme2earn?"}>😊😊😊</Pane>
            </Variant>
            <Variant title={"Secondary"}>
              <Pane type={PaneType.Secondary} title={"Competitions"}>
                🙁🙁🙁
              </Pane>
            </Variant>
          </div>
        </SubComponent>
      </div>
    </AppLayout>
  );
};

export default Components;
