import { CategorySpending, MonthlyReport } from "./analytics";

export type { CategorySpending, MonthlyReport };

export interface DashboardSummary {
  total_balance: number;
  monthly_income: number;
  monthly_expense: number;
  savings_rate: number;
  top_expense_category: CategorySpending | null;
  wallet_count: number;
  transaction_count_this_month: number;
}
