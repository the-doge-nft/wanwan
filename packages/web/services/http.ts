import axios, { AxiosRequestConfig } from "axios";
import env from "../environment";

const config: AxiosRequestConfig = {
  baseURL: env.api.baseUrl,
  withCredentials: true,
};

const http = axios.create(config);

export default http;
