import api from "./api";
import { ApiResponse } from "@/types";
import { MonthlyReport } from "@/types/analytics";

export const reportService = {
  getMonthlyReport: async (month?: number, year?: number) => {
    const response = await api.get<ApiResponse<MonthlyReport>>("/api/reports/monthly", {
      params: { month, year }
    });
    return response.data;
  },
};
