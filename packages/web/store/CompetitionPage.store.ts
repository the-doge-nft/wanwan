import { Competition, NextString, SearchParams } from "../interfaces";
import Http from "../services/http";
import GridOrColumnScrollableStore from "./GridOrColumnScrollable.store";

class CompetitionPageStore extends GridOrColumnScrollableStore<Competition> {
  localStorageKey = "competition-view";

  constructor(
    competitions: Competition[],
    next: NextString,
    params: SearchParams
  ) {
    super("competitions-page", competitions, next, params);
  }

  query() {
    return Http.searchCompetition(this.getQueryConfig().params).then(
      ({ data }) => data
    );
  }
}

export default CompetitionPageStore;
