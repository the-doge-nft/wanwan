import axios, { AxiosRequestConfig } from "axios";
import env from "../environment";
import ApiErrorInterceptor from "./interceptors/api-error.interceptor";

const config: AxiosRequestConfig = {
  baseURL: env.api.baseUrl,
  withCredentials: true,
};

const http = axios.create(config);
http.interceptors.response.use((res) => res, ApiErrorInterceptor);

export default http;
