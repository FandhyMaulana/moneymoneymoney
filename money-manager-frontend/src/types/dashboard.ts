export interface CategorySpending {
  id: string;
  name: string;
  amount: number;
  percentage: number;
}

export interface DashboardSummary {
  total_balance: number;
  monthly_income: number;
  monthly_expense: number;
  savings_rate: number;
  top_expense_category: CategorySpending | null;
  wallet_count: number;
  transaction_count_this_month: number;
}

export interface MonthlyReport {
  month: number;
  year: number;
  income: number;
  expense: number;
  savings: number;
  categories: CategorySpending[];
}
