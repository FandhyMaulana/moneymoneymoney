import api from "./api";
import { ApiResponse } from "@/types";
import { DashboardSummary, MonthlyReport } from "@/types/dashboard";

export const dashboardService = {
  getSummary: async () => {
    const response = await api.get<ApiResponse<DashboardSummary>>("/api/dashboard");
    return response.data;
  },
};

export const reportService = {
  getMonthly: async (month: number, year: number) => {
    const response = await api.get<ApiResponse<MonthlyReport>>("/api/reports/monthly", {
      params: { month, year }
    });
    return response.data;
  }
};
