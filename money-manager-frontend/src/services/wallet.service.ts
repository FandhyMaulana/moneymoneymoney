import api from "./api";
import { ApiResponse } from "@/types";

export const walletService = {
  getAll: async (params?: any) => {
    const response = await api.get<ApiResponse<any[]>>("/api/wallets", { params });
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post<ApiResponse<any>>("/api/wallets", data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<any>>(`/api/wallets/${id}`);
    return response.data;
  },
};
