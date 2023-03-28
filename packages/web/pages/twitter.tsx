import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Spinner from "../components/DSL/Spinner/Spinner";
import Text, { TextSize, TextType } from "../components/DSL/Text/Text";
import { debugToast, errorToast } from "../components/DSL/Toast/Toast";
import Logo from "../components/Logo/Logo";
import { css } from "../helpers/css";
import BlankLayout from "../layouts/Blank.layout";
import Http from "../services/http";
import AppStore from "../store/App.store";

const Twitter = observer(() => {
  const router = useRouter();
  useEffect(() => {
    if (AppStore.auth.isAuthed) {
      Http.postTwitterAuth({
        oauth_token: router.query.oauth_token as string,
        oauth_verifier: router.query.oauth_verifier as string,
      })
        .then(({ data }) => {
          AppStore.auth.profile = data;
          debugToast(
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
  }, [router, AppStore.auth.isAuthed]);
  return (
    <BlankLayout>
      <div className={css("flex", "grow", "flex-col")}>
        <div
          className={css(
            "flex",
            "flex-col",
            "items-center",
            "grow",
            "justify-center"
          )}
        >
          <Spinner />
          <div className={css("mt-0.5")}>
            <Text size={TextSize.xs} type={TextType.Grey}>
              [authorizing twitter]
            </Text>
          </div>
        </div>
        <div className={css("flex", "justify-center")}>
          <Text size={TextSize.xs} type={TextType.Grey}>
            <Logo size={24} />
          </Text>
        </div>
      </div>
    </BlankLayout>
  );
});

export default Twitter;
