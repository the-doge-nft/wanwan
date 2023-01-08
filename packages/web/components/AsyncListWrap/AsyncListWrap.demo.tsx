import { css } from "../../helpers/css";
import { SubComponent, Variant } from "../../pages/components";
import AsyncListWrap from "./AsyncListWrap";

const AsyncListWrapDemo = () => {
  return (
    <SubComponent title={"Async List Wrap"}>
      <Variant title={"Default List Wrap"}>
        <AsyncListWrap isLoading={true} hasData={false} />
      </Variant>
      <Variant title={"Custom Loader"} className={css("mt-2")}>
        <AsyncListWrap
          isLoading={true}
          hasData={false}
          quantity={3}
          renderRow={() => (
            <div className={css("flex", "items-center")}>
              <div
                className={css("rounded-full", "bg-slate-300")}
                style={{ width: 40, height: 40 }}
              />
              <div
                className={css(
                  "bg-slate-300",
                  "w-full",
                  "ml-4",
                  "my-2",
                  "self-stretch"
                )}
              />
            </div>
          )}
        />
      </Variant>
    </SubComponent>
  );
};

export default AsyncListWrapDemo;
