import { Nft } from "alchemy-sdk";
import axios, { AxiosInstance } from "axios";
import { SiweMessage } from "siwe";
import env from "../environment";
import { encodeBase64 } from "../helpers/strings";
import {
  Comment,
  Competition,
  CompetitionMeme,
  CompetitionVoteReason,
  Leaderboard,
  Media,
  MediaRequirements,
  Meme,
  ProfileDto,
  Reward,
  Search,
  SearchParams,
  SearchResponse,
  Stats,
  Submission,
  Tweet,
  TweetReply,
  User,
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

  updateCompetitionCoverPhoto(id: number, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return this.http.post<Competition>(`/competition/${id}/cover`, formData);
  }

  postMedia(formData: FormData) {
    return this.http.post<Media>("/media", formData);
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

  getCompetitionRankedMemes(id: number | string) {
    return this.http.get<CompetitionMeme[]>(`/competition/${id}/meme/ranked`);
  }

  postRewardSettled({ rewardId, txId }: { rewardId: number; txId: string }) {
    return this.http.post<Reward>(`/competition/reward/${rewardId}/confirmed`, {
      rewardId,
      txId,
    });
  }

  postRewardConfirming({ rewardId, txId }: { rewardId: number; txId: string }) {
    return this.http.post<Reward>(
      `/competition/reward/${rewardId}/confirming`,
      {
        rewardId,
        txId,
      }
    );
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
    return this.http.post<User>("/twitter/delete");
  }

  postTwitterAuth(body: { oauth_token: string; oauth_verifier: string }) {
    return this.http.post<User>("/twitter/callback", body);
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

  getIsAdmin() {
    return this.http.get("/admin/isAdmin");
  }

  getAdminTweet() {
    return this.http.get<{ meme: Meme; tweet: Tweet; reply: TweetReply }>(
      "/admin/tweet"
    );
  }

  postEnsForAddress(ens: string) {
    return this.http.post("/ens/resolveEns", { ens });
  }

  postAddressForEns(address: string) {
    return this.http.post("/ens/resolveName", { address });
  }

  getWallet() {
    return this.http.get("/wallet");
  }

  getNftContractHolders(contractAddress: string) {
    return this.http.get<{ owners: Array<string> }>(
      `/nft/${contractAddress}/holders`
    );
  }

  getNftsForContract(contractAddress: string) {
    return this.http.get<{ nfts: Nft[] }>(`/nft/${contractAddress}`);
  }

  getTokenType(contractAddress: string) {
    return this.http.get(`/contract/${contractAddress}`);
  }

  getLikeMeme(id: number | string) {
    return this.http.get(`/meme/${id}/like`);
  }

  getUnlikeMeme(id: number | string) {
    return this.http.get(`/meme/${id}/unlike`);
  }

  getAddressLikes(address: string) {
    return this.http.get<Array<Meme>>(`/profile/${address}/likes`);
  }

  getLeaderboard() {
    return this.http.get<Array<Leaderboard>>("/leaderboard");
  }

  postSearch(search: string, signal?: AbortSignal) {
    return this.http.post<Search>("/search", { search }, { signal });
  }

  getCanUserVoteReason(competitionId: number) {
    return this.http.get<Array<CompetitionVoteReason>>(
      `/competition/${competitionId}/voteReason`
    );
  }

  static create() {
    return new this(env.api.baseUrl);
  }
}

const Http = _Http.create();
export default Http;
