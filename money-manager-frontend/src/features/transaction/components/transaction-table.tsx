"use client";

import { Transaction, TransactionType } from "@/types";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { TransactionTypeBadge } from "./transaction-type-badge";
import { AmountDisplay } from "./amount-display";
import { formatDate } from "@/utils/format";
import { Category } from "@/services/category.service";
import { Wallet } from "@/types";
import { 
  MoreVertical, 
  Pencil, 
  Trash2, 
  ExternalLink 
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface TransactionTableProps {
  transactions: Transaction[];
  categories: Category[];
  wallets: Wallet[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function TransactionTable({ 
  transactions, 
  categories, 
  wallets, 
  onEdit, 
  onDelete,
  isLoading 
}: TransactionTableProps) {
  const getCategoryName = (id?: string) => {
    if (!id) return "Uncategorized";
    return categories.find(c => c.id === id)?.name || "Unknown Category";
  };

  const getWalletName = (id?: string) => {
    if (!id) return "-";
    return wallets.find(w => w.id === id)?.name || "Unknown Wallet";
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[120px]">Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell><div className="h-4 w-20 bg-muted animate-pulse rounded" /></TableCell>
                <TableCell><div className="h-6 w-24 bg-muted animate-pulse rounded-full" /></TableCell>
                <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                <TableCell className="text-right"><div className="h-4 w-16 ml-auto bg-muted animate-pulse rounded" /></TableCell>
                <TableCell><div className="h-8 w-8 bg-muted animate-pulse rounded" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[120px] font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Account</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="text-right font-semibold">Amount</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id} className="group hover:bg-muted/20 transition-colors">
                <TableCell className="text-muted-foreground whitespace-nowrap">
                  {formatDate(tx.transaction_date)}
                </TableCell>
                <TableCell>
                  <TransactionTypeBadge type={tx.type} />
                </TableCell>
                <TableCell className="font-medium">
                  {tx.type === "transfer" ? (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs text-muted-foreground">From: {getWalletName(tx.source_wallet_id)}</span>
                      <span className="text-xs text-muted-foreground">To: {getWalletName(tx.destination_wallet_id)}</span>
                    </div>
                  ) : (
                    getWalletName(tx.type === "income" ? tx.destination_wallet_id : tx.source_wallet_id)
                  )}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-2">
                    <span className="size-2 rounded-full bg-primary/20" />
                    {getCategoryName(tx.category_id)}
                  </span>
                  {tx.note && (
                    <p className="text-[10px] text-muted-foreground mt-1 truncate max-w-[150px]">
                      {tx.note}
                    </p>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <AmountDisplay amount={tx.amount} type={tx.type} />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(tx)} className="cursor-pointer">
                        <Pencil className="mr-2 size-4" />
                        Edit
                      </DropdownMenuItem>
                      {tx.attachment_url && (
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <a href={tx.attachment_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 size-4" />
                            View Attachment
                          </a>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => onDelete(tx.id)} 
                        className="text-destructive cursor-pointer focus:bg-destructive focus:text-destructive-foreground"
                      >
                        <Trash2 className="mr-2 size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
