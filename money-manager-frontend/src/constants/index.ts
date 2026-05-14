export const APP_NAME = "Money Manager";
export const APP_DESCRIPTION = "Modern personal finance dashboard";

export const ROUTES = {
  DASHBOARD: "/dashboard",
  TRANSACTIONS: "/transactions",
  WALLETS: "/wallets",
  BUDGETS: "/budgets",
  ANALYTICS: "/analytics",
  RECURRING: "/recurring",
  LOGIN: "/login",
  REGISTER: "/register",
  SETTINGS: "/settings",
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    ME: "/auth/me",
  },
  TRANSACTIONS: "/transactions",
  WALLETS: "/wallets",
  BUDGETS: "/budgets",
  DASHBOARD: {
    SUMMARY: "/dashboard/summary",
    CHARTS: "/dashboard/charts",
  },
};
