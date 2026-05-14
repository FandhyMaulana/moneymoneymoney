import api from "./api";
import { ApiResponse } from "@/types";
import { 
  RecurringTransaction, 
  RecurringFormData, 
  RecurringQuery 
} from "@/types/recurring";

export const recurringService = {
  getAll: async (params?: RecurringQuery) => {
    const response = await api.get<ApiResponse<RecurringTransaction[]>>("/api/recurring-transactions", { 
      params 
    });
    return response.data;
  },
  create: async (data: RecurringFormData) => {
    const response = await api.post<ApiResponse<RecurringTransaction>>("/api/recurring-transactions", data);
    return response.data;
  },
  update: async (id: string, data: Partial<RecurringFormData>) => {
    const response = await api.put<ApiResponse<RecurringTransaction>>(`/api/recurring-transactions/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<any>>(`/api/recurring-transactions/${id}`);
    return response.data;
  },
};
