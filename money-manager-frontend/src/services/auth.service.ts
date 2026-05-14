import api from "./api";
import { ApiResponse } from "@/types";

export const authService = {
  login: async (credentials: any) => {
    const response = await api.post<ApiResponse<{ token: string }>>("/auth/login", credentials);
    return response.data;
  },
  register: async (data: any) => {
    const response = await api.post<ApiResponse<any>>("/auth/register", data);
    return response.data;
  },
  me: async () => {
    const response = await api.get<ApiResponse<any>>("/api/me");
    return response.data;
  },
};
