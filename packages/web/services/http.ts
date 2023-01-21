import { Meme } from "@prisma/client";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import env from "../environment";
import { Competition, SearchResponse, Stats } from "../interfaces";
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

  competitionSearch(params: SearchParams) {
    return this.http.get<SearchResponse<Competition>>(
      "/competition/search",
      params
    );
  }

  memeSearch(params: SearchParams) {
    return this.http.get<SearchResponse<Meme>>("/meme/search", params);
  }

  stats() {
    return this.http.get<Stats>("/stats");
  }
}

export const newHttp = new Http();
