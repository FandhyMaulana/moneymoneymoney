import api from "./api";
import { ApiResponse, Transaction } from "@/types";

export const transactionService = {
  getAll: async (params?: any) => {
    const response = await api.get<ApiResponse<Transaction[]>>("/api/transactions", { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Transaction>>(`/api/transactions/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post<ApiResponse<Transaction>>("/api/transactions", data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<any>>(`/api/transactions/${id}`);
    return response.data;
  },
  export: async (params?: any) => {
    const response = await api.get("/api/transactions/export", { 
      params,
      responseType: 'blob'
    });
    return response.data;
  }
};
