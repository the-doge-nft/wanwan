import http from "../services/http";

export default class CreateCompetitionStore {
  constructor() {}

  onCompetitionSubmit(values: any) {
    return http.post(`/competition`, { ...values });
  }
}
