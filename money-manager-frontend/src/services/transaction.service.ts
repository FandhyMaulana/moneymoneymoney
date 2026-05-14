import api from "./api";
import { ApiResponse, Transaction } from "@/types";
import { TransactionFilterParams, TransactionFormData } from "@/types/transaction";

export const transactionService = {
  getAll: async (params?: TransactionFilterParams) => {
    const response = await api.get<ApiResponse<Transaction[]>>("/api/transactions", { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Transaction>>(`/api/transactions/${id}`);
    return response.data;
  },
  create: async (data: TransactionFormData) => {
    const response = await api.post<ApiResponse<Transaction>>("/api/transactions", data);
    return response.data;
  },
  update: async (id: string, data: Partial<TransactionFormData>) => {
    const response = await api.put<ApiResponse<Transaction>>(`/api/transactions/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/api/transactions/${id}`);
    return response.data;
  },
  export: async (params?: TransactionFilterParams) => {
    const response = await api.get("/api/transactions/export", { 
      params,
      responseType: 'blob'
    });
    return response.data;
  }
};
