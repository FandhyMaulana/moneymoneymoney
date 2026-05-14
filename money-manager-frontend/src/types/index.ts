export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  pagination?: PaginationMeta;
}

export type TransactionType = "income" | "expense" | "transfer";

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  category_id?: string;
  source_wallet_id?: string;
  destination_wallet_id?: string;
  reference_no?: string;
  note?: string;
  attachment_url?: string;
  transaction_date: string;
  created_at: string;
  updated_at?: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  name: string;
  type: string;
  balance: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}
