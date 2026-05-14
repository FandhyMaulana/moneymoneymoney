export interface CategorySpending {
  id: string;
  name: string;
  amount: number;
  percentage: number;
}

export interface MonthlyReport {
  month: number;
  year: number;
  income: number;
  expense: number;
  savings: number;
  categories: CategorySpending[];
}

export interface SpendingTrend {
  date: string;
  income: number;
  expense: number;
  savings: number;
}
