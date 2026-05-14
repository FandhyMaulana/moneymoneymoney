import api from "./api";
import { ApiResponse } from "@/types";

export const dashboardService = {
  getSummary: async () => {
    const response = await api.get<ApiResponse<any>>("/api/dashboard");
    return response.data;
  },
};

export const reportService = {
  getMonthly: async (month: number, year: number) => {
    const response = await api.get<ApiResponse<any>>("/api/reports/monthly", {
      params: { month, year }
    });
    return response.data;
  }
};
