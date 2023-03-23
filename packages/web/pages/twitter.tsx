import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Spinner from "../components/DSL/Spinner/Spinner";
import Text, { TextSize, TextType } from "../components/DSL/Text/Text";
import { errorToast, successToast } from "../components/DSL/Toast/Toast";
import { css } from "../helpers/css";
import BlankLayout from "../layouts/Blank.layout";
import Http from "../services/http";
import AppStore from "../store/App.store";

const Twitter = observer(() => {
  const router = useRouter();
  console.log(router.query);
  useEffect(() => {
    if (AppStore.auth.isAuthed) {
      Http.postTwitterAuth({
        code: router.query.code as string,
        state: router.query.state as string,
      })
        .then(({ data }) => {
          AppStore.auth.profile = data;
          successToast(
            `Twitter user ${AppStore.auth.profile.user.twitterUsername} linked`
          );
        })
        .catch((e) => {
          console.error(e);
          errorToast("Could not authenticate with Twitter");
        })
        .finally(() =>
          router.push({ query: { showSettingsModal: true }, pathname: "/" })
        );
    }
  }, [router]);
  return (
    <BlankLayout>
      <div className={css("flex", "items-center", "grow", "justify-center")}>
        <div className={css("flex", "flex-col", "items-center")}>
          <Spinner />
          <div className={css("mt-0.5")}>
            <Text size={TextSize.xs} type={TextType.Grey}>
              [authing with twitter...]
            </Text>
          </div>
        </div>
      </div>
    </BlankLayout>
  );
});

export default Twitter;
