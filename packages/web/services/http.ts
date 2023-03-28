import axios, { AxiosInstance } from "axios";
import { SiweMessage } from "siwe";
import env from "../environment";
import { encodeBase64 } from "../helpers/strings";
import {
  Comment,
  Competition,
  CompetitionMeme,
  MediaRequirements,
  Meme,
  Profile,
  ProfileDto,
  Reward,
  SearchParams,
  SearchResponse,
  Stats,
  Submission,
} from "../interfaces";
import AppStore from "../store/App.store";
import ApiErrorInterceptor from "./interceptors/api-error.interceptor";

class _Http {
  http: AxiosInstance;
  constructor(private readonly baseURL: string) {
    this.http = axios.create({
      baseURL,
      withCredentials: true,
    });
    this.http.interceptors.response.use((res) => res, ApiErrorInterceptor);
  }

  private getSearchConfig(params: SearchParams) {
    return {
      count: params.count,
      offset: params.offset,
      config: encodeBase64({
        sorts: params.sorts,
        filters: params.filters,
      }),
    };
  }

  searchCompetition(params: SearchParams) {
    return this.http.get<SearchResponse<Competition>>("/competition/search", {
      params: this.getSearchConfig(params),
    });
  }

  searchMeme(params: SearchParams) {
    return this.http.get<SearchResponse<Meme>>("/meme/search", {
      params: this.getSearchConfig(params),
    });
  }

  stats() {
    return this.http.get<Stats>("/stats");
  }

  postCompetition(body: object) {
    return this.http.post<Competition>("/competition", body).then((res) => {
      AppStore.events.publish(AppStore.events.events.COMPETITION_CREATED);
      return res;
    });
  }

  postSubmission({
    memeId,
    competitionId,
  }: {
    memeId: number | string;
    competitionId: number | string;
  }) {
    return this.http.post<Submission>("/submission", { memeId, competitionId });
  }

  postMeme(formData: FormData) {
    return this.http.post<Meme>("/meme", formData);
  }

  getCompetition(id: number | string) {
    return this.http.get<Competition>(`/competition/${id}`);
  }

  getCompetitionMemes(id: number | string) {
    return this.http.get<CompetitionMeme[]>(`/competition/${id}/meme/ranked`);
  }

  updateReward({ rewardId, txId }: { rewardId: number; txId: string }) {
    return this.http.post<Reward>(`/competition/reward/${rewardId}`, {
      rewardId,
      txId,
    });
  }

  logout() {
    return this.http.get("/auth/logout");
  }

  login(body: { message: SiweMessage; signature: string }) {
    return this.http.post("/auth/login", body);
  }

  getMeme(id: string) {
    return this.http.get<Meme>(`/meme/${id}`);
  }

  getCompetitionMemeSubmissions(competitionId: number | SVGStringList) {
    return this.http.get<CompetitionMeme[]>(
      `/competition/${competitionId}/meme/submissions`
    );
  }

  getProfile(addressOrEns: string) {
    return this.http.get(`/profile/${addressOrEns}`);
  }

  postProfile(profile: ProfileDto) {
    return this.http.post("/profile", profile);
  }

  getNonce() {
    return this.http.get("/auth/nonce");
  }

  getStatus() {
    return this.http.get("/auth/status");
  }

  getComments(memeId: string) {
    return this.http.get<Comment[]>(`/meme/${memeId}/comment`);
  }

  deleteTwitterUsername() {
    return this.http.post<Profile>("/twitter/delete");
  }

  postTwitterAuth(body: { oauth_token: string; oauth_verifier: string }) {
    return this.http.post<Profile>("/twitter/callback", body);
  }

  getTwitterLoginUrl() {
    return this.baseURL + "/twitter/login";
  }

  postComment({
    memeId,
    body,
    parentCommentId,
  }: {
    memeId: string | number;
    body: string;
    parentCommentId?: string | number;
  }) {
    return this.http.post<Comment>(`/meme/${memeId}/comment`, {
      body,
      parentCommentId,
    });
  }

  getMediaRequirements() {
    return this.http.get<MediaRequirements>("/media/requirements");
  }

  postVote({
    competitionId,
    score,
    memeId,
  }: {
    competitionId: number | string;
    score: number | string;
    memeId: number | string;
  }) {
    return this.http.post(`/competition/${competitionId}/vote`, {
      score,
      memeId,
    });
  }

  postCurateCompetitionMeme({
    competitionId,
    memeId,
  }: {
    competitionId: number;
    memeId: number;
  }) {
    return this.http.post(
      `/competition/${competitionId}/meme/submissions/curate`,
      { memeId }
    );
  }

  static create() {
    return new this(env.api.baseUrl);
  }
}

const Http = _Http.create();
export default Http;
