import { observer } from "mobx-react-lite";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useEffect, useMemo } from "react";
import GridOrColumnScrollableView from "../components/GridOrColumnScrollableView/GridOrColumnScrollableView";
import CompetitionPreviewLink from "../components/PreviewLink/CompetitionPreviewLink";
import env from "../environment";
import { Competition, NextString, SearchParams } from "../interfaces";
import AppLayout from "../layouts/App.layout";
import Http from "../services/http";
import redirectTo404 from "../services/redirect/404";
import CompetitionPageStore from "../store/CompetitionPage.store";

interface CompetitionsPageProps {
  competitions: Competition[];
  params: SearchParams;
  next?: NextString;
}

const CompetitionsPage = observer(
  ({ competitions, next, params }: CompetitionsPageProps) => {
    const store = useMemo(
      () => new CompetitionPageStore(competitions, next, params),
      [competitions, next, params]
    );

    useEffect(() => {
      store.init();
    }, []);
    return (
      <>
        <Head>
          <title>Competitions - {env.app.name}</title>
        </Head>
        <AppLayout>
          <GridOrColumnScrollableView<Competition>
            title={"Competitions"}
            store={store}
            renderColumnItem={(comp) => (
              <CompetitionPreviewLink competition={comp} />
            )}
            renderGridItem={(comp) => (
              <CompetitionPreviewLink competition={comp} />
            )}
          />
        </AppLayout>
      </>
    );
  }
);

export const getServerSideProps: GetServerSideProps<
  CompetitionsPageProps
> = async () => {
  const params: SearchParams = {
    count: 48,
    offset: 0,
    sorts: [{ key: "createdAt", direction: "desc" }],
    filters: [],
  };
  try {
    const {
      data: { data: competitions, next },
    } = await Http.searchCompetition(params);
    return {
      props: { competitions, params, next },
    };
  } catch (e) {
    return redirectTo404();
  }
};

export default CompetitionsPage;
