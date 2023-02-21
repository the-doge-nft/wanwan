import { Meme } from "@prisma/client";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { SiweMessage } from "siwe";
import env from "../environment";
import { Competition, SearchResponse, Stats } from "../interfaces";
import AppStore from "../store/App.store";
import ApiErrorInterceptor from "./interceptors/api-error.interceptor";

const config: AxiosRequestConfig = {
  baseURL: env.api.baseUrl,
  withCredentials: true,
};

const http = axios.create(config);
http.interceptors.response.use((res) => res, ApiErrorInterceptor);

export default http;

interface SearchParams {}
class Http {
  http: AxiosInstance;
  constructor() {
    this.http = axios.create(config);
    this.http.interceptors.response.use((res) => res, ApiErrorInterceptor);
  }

  competitionSearch(params: SearchParams = {}) {
    return this.http.get<SearchResponse<Competition>>("/competition/search", {
      params,
    });
  }

  memeSearch(params: SearchParams = {}) {
    return this.http.get<SearchResponse<Meme>>("/meme/search", { params });
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

  getCompetition(id: number) {
    return this.http.get<Competition>(`/competition/${id}`);
  }

  updateReward({ rewardId, txId }: { rewardId: number; txId: string }) {
    return this.http.post(`/competition/reward/${rewardId}`, {
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
}

export const newHttp = new Http();
