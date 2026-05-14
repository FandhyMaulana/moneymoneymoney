import api from "./api";
import { ApiResponse } from "@/types";

export const budgetService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<any[]>>("/api/budgets");
    return response.data;
  },
  getSummary: async (month: number, year: number) => {
    const response = await api.get<ApiResponse<any>>("/api/budgets/summary", {
      params: { month, year }
    });
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post<ApiResponse<any>>("/api/budgets", data);
    return response.data;
  },
};
