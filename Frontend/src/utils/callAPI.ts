import axios, { AxiosRequestConfig, Method } from "axios";
import ENV from "@/src/utils/config"

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

const API = axios.create({
  baseURL: ENV.BACKEND_URL+ "/api",
  withCredentials: true,
});

export const apiCall = async <T = any>(
  endpoint: string,
  method: Method = "GET",
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    console.log(endpoint)
    const response = await API.request<T>({
      url: endpoint,
      method,
      data,
      ...config,
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("API Error:", error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || "Something went wrong!",
    };
  }
};
