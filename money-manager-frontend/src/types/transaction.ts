import { z } from "zod";
import { TransactionType } from "./index";

export interface TransactionFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: TransactionType;
  category_id?: string;
  wallet_id?: string;
  min_amount?: number;
  max_amount?: number;
  month?: number;
  year?: number;
  start_date?: string;
  end_date?: string;
  sort?: "newest" | "oldest" | "highest" | "lowest";
}

export const transactionSchema = z.object({
  type: z.enum(["income", "expense", "transfer"]),
  amount: z.coerce.number().gt(0, "Amount must be greater than 0"),
  category_id: z.string().uuid("Please select a category").optional().nullable(),
  source_wallet_id: z.string().uuid("Please select a source wallet").optional().nullable(),
  destination_wallet_id: z.string().uuid("Please select a destination wallet").optional().nullable(),
  reference_no: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
  attachment_url: z.string().url("Please enter a valid URL").optional().nullable().or(z.literal("")),
  transaction_date: z.string().min(1, "Date is required"),
}).refine((data) => {
  if (data.type === "income") {
    return !!data.destination_wallet_id;
  }
  if (data.type === "expense") {
    return !!data.source_wallet_id;
  }
  if (data.type === "transfer") {
    return !!data.source_wallet_id && !!data.destination_wallet_id && data.source_wallet_id !== data.destination_wallet_id;
  }
  return true;
}, {
  message: "Wallet selection is invalid for the transaction type",
  path: ["source_wallet_id"], // Default path
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
