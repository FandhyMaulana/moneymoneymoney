import api from "./api";
import { ApiResponse } from "@/types";

export interface Category {
  id: string;
  name: string;
  parent_id?: string;
  is_system: boolean;
  created_at: string;
}

export const categoryService = {
  getAll: async (params?: any) => {
    const response = await api.get<ApiResponse<Category[]>>("/api/categories", { params });
    return response.data;
  },
  create: async (data: { name: string; parent_id?: string }) => {
    const response = await api.post<ApiResponse<Category>>("/api/categories", data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/api/categories/${id}`);
    return response.data;
  },
};
