import api from "./api";
import { ApiResponse } from "@/types";

export const recurringService = {
  getAll: async (params?: any) => {
    const response = await api.get<ApiResponse<any[]>>("/api/recurring-transactions", { params });
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post<ApiResponse<any>>("/api/recurring-transactions", data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put<ApiResponse<any>>(`/api/recurring-transactions/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<any>>(`/api/recurring-transactions/${id}`);
    return response.data;
  },
};
