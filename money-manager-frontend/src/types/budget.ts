export interface BudgetResponse {
  id: string;
  category_id: string;
  amount: number;
  period_month: number;
  period_year: number;
}

export interface BudgetDetail {
  id: string;
  category_id: string;
  category_name: string;
  budget_limit: number;
  spent: number;
  remaining: number;
  percentage: number;
  status: 'safe' | 'warning' | 'exceeded';
  alert?: string;
}

export interface BudgetSummary {
  month: number;
  year: number;
  budgets: BudgetDetail[];
}

export interface UpsertBudgetRequest {
  category_id: string;
  amount: number;
  period_month: number;
  period_year: number;
}
