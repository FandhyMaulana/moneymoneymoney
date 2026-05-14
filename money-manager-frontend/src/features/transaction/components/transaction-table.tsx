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

import { Skeleton } from "@/components/ui/skeleton";

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
      <div className="rounded-[var(--radius-table)] border bg-card overflow-hidden">
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
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                <TableCell><Skeleton className="size-8" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-table)] border bg-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-accent/30">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="w-[120px] text-[10px] font-bold uppercase tracking-widest">Date</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">Type</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">Account</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">Category</TableHead>
              <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest">Amount</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id} className="group hover:bg-muted/30 transition-all duration-200 border-b-muted/50">
                <TableCell className="text-muted-foreground whitespace-nowrap text-xs font-bold financial-data">
                  {formatDate(tx.transaction_date, { month: 'short', day: '2-digit', year: 'numeric' })}
                </TableCell>
                <TableCell>
                  <TransactionTypeBadge type={tx.type} />
                </TableCell>
                <TableCell>
                  {tx.type === "transfer" ? (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">From: {getWalletName(tx.source_wallet_id)}</span>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">To: {getWalletName(tx.destination_wallet_id)}</span>
                    </div>
                  ) : (
                    <span className="text-xs font-black tracking-tight text-foreground">
                      {getWalletName(tx.type === "income" ? tx.destination_wallet_id : tx.source_wallet_id)}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-black tracking-tight text-foreground flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-primary/40" />
                      {getCategoryName(tx.category_id)}
                    </span>
                    {tx.note && (
                      <p className="text-[10px] font-medium text-muted-foreground truncate max-w-[150px] leading-none">
                        {tx.note}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <AmountDisplay amount={tx.amount} type={tx.type} className="text-sm font-black financial-data" />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-accent">
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl border-none shadow-2xl">
                      <DropdownMenuItem onClick={() => onEdit(tx)} className="cursor-pointer rounded-lg m-1">
                        <Pencil className="mr-2 size-4" />
                        <span className="font-bold text-xs uppercase tracking-wider">Edit</span>
                      </DropdownMenuItem>
                      {tx.attachment_url && (
                        <DropdownMenuItem asChild className="cursor-pointer rounded-lg m-1">
                          <a href={tx.attachment_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 size-4" />
                            <span className="font-bold text-xs uppercase tracking-wider">View Attachment</span>
                          </a>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => onDelete(tx.id)} 
                        className="text-destructive cursor-pointer focus:bg-destructive/10 focus:text-destructive rounded-lg m-1"
                      >
                        <Trash2 className="mr-2 size-4" />
                        <span className="font-bold text-xs uppercase tracking-wider">Delete</span>
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
