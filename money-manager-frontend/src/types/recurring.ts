import { z } from "zod";
import { TransactionType } from "./index";

export type RecurringFrequency = "daily" | "weekly" | "monthly" | "yearly";

export interface RecurringTransaction {
  id: string;
  wallet_id: string;
  category_id: string;
  type: TransactionType;
  amount: number;
  note: string;
  frequency: RecurringFrequency;
  start_date: string;
  next_run_date: string;
  is_active: boolean;
  created_at: string;
}

export const recurringSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.coerce.number().gt(0, "Amount must be greater than 0"),
  wallet_id: z.string().uuid("Please select a wallet"),
  category_id: z.string().uuid("Please select a category"),
  frequency: z.enum(["daily", "weekly", "monthly", "yearly"]),
  start_date: z.string().min(1, "Start date is required"),
  note: z.string().optional().default(""),
  is_active: z.boolean().default(true),
});

export type RecurringFormData = z.infer<typeof recurringSchema>;

export interface RecurringQuery {
  page?: number;
  limit?: number;
  search?: string;
}
