import api from "./api";
import { ApiResponse } from "@/types";
import { AuthResponse, LoginCredentials, RegisterData, UserMeResponse } from "@/types/auth";

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<ApiResponse<AuthResponse>>("/auth/login", credentials);
    return response.data;
  },
  register: async (data: RegisterData) => {
    const { confirmPassword, ...registerPayload } = data;
    const response = await api.post<ApiResponse<null>>("/auth/register", registerPayload);
    return response.data;
  },
  me: async () => {
    const response = await api.get<ApiResponse<UserMeResponse>>("/api/me");
    return response.data;
  },
};
