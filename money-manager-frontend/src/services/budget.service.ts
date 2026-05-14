import api from "./api";
import { ApiResponse } from "@/types";
import { BudgetResponse, BudgetSummary, UpsertBudgetRequest } from "@/types/budget";

export const budgetService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<BudgetResponse[]>>("/api/budgets");
    return response.data;
  },
  getSummary: async (month?: number, year?: number) => {
    const response = await api.get<ApiResponse<BudgetSummary>>("/api/budgets/summary", {
      params: { month, year }
    });
    return response.data;
  },
  create: async (data: UpsertBudgetRequest) => {
    const response = await api.post<ApiResponse<BudgetResponse>>("/api/budgets", data);
    return response.data;
  },
};
