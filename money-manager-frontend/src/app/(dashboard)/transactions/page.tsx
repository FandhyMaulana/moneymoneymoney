"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { transactionService } from "@/services/transaction.service";
import { categoryService } from "@/services/category.service";
import { walletService } from "@/services/wallet.service";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { TransactionTable } from "@/features/transaction/components/transaction-table";
import { TransactionFilters } from "@/features/transaction/components/transaction-filters";
import { TransactionForm } from "@/features/transaction/components/transaction-form";
import { Pagination } from "@/components/shared/pagination";
import { SectionHeader } from "@/components/shared/section-header";
import { PageContainer } from "@/components/shared/page-container";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Plus, 
  Download, 
  History, 
  AlertCircle 
} from "lucide-react";
import { useState, useCallback } from "react";
import { Transaction } from "@/types";
import { TransactionFormData } from "@/types/transaction";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

export default function TransactionsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  // Filter params from URL
  const params = {
    page: Number(searchParams.get("page")) || 1,
    limit: 10,
    search: searchParams.get("search") || undefined,
    type: searchParams.get("type") as any || undefined,
    category_id: searchParams.get("category_id") || undefined,
    wallet_id: searchParams.get("wallet_id") || undefined,
  };

  // Queries
  const { data: transactionsRes, isLoading: isTxsLoading } = useQuery({
    queryKey: ["transactions", params],
    queryFn: () => transactionService.getAll(params),
  });

  const { data: categoriesRes } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getAll({ limit: 100 }),
  });

  const { data: walletsRes } = useQuery({
    queryKey: ["wallets"],
    queryFn: () => walletService.getAll({ limit: 100 }),
  });

  const transactions = transactionsRes?.data || [];
  const pagination = transactionsRes?.pagination;
  const categories = categoriesRes?.data || [];
  const wallets = walletsRes?.data || [];

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: TransactionFormData) => transactionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      toast.success("Transaction added successfully");
      setIsFormOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to add transaction");
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TransactionFormData> }) => 
      transactionService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      toast.success("Transaction updated successfully");
      setIsFormOpen(false);
      setEditingTransaction(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to update transaction");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => transactionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      toast.success("Transaction deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to delete transaction");
    }
  });

  // Handlers
  const handleEdit = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
      setDeleteId(null);
    }
  };

  const handleFormSubmit = (data: TransactionFormData) => {
    if (editingTransaction) {
      updateMutation.mutate({ id: editingTransaction.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await transactionService.export(params);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transactions-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error("Failed to export transactions");
    }
  };

  return (
    <PageContainer>
      <div className="space-y-8">
        <SectionHeader 
          title="Transactions" 
          description="Manage and track all your financial activities."
        >
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-xl bg-accent/30 border-none"
            onClick={handleExport}
          >
            <Download className="mr-2 size-4" />
            Export CSV
          </Button>
          <Button 
            size="sm" 
            className="rounded-xl shadow-lg shadow-primary/20"
            onClick={() => {
              setEditingTransaction(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="mr-2 size-4" />
            New Transaction
          </Button>
        </SectionHeader>

        <TransactionFilters 
          categories={categories} 
          wallets={wallets} 
        />

        {transactions.length === 0 && !isTxsLoading ? (
          <EmptyState
            title="No transactions found"
            description="Start by adding your first transaction to track your spending habits."
            icon={History}
            action={{
              label: "Add Transaction",
              onClick: () => setIsFormOpen(true)
            }}
          />
        ) : (
          <div className="space-y-4">
            <TransactionTable 
              transactions={transactions}
              categories={categories}
              wallets={wallets}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isLoading={isTxsLoading}
            />
            
            {pagination && (
              <Pagination 
                page={pagination.page}
                totalPages={pagination.total_pages}
                onPageChange={(page) => {
                  router.push(`${pathname}?${createQueryString("page", page.toString())}`);
                }}
                isLoading={isTxsLoading}
              />
            )}
          </div>
        )}

        <Dialog open={isFormOpen} onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingTransaction(null);
        }}>
          <DialogContent className="max-w-2xl rounded-3xl border-none shadow-2xl p-8">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold">
                {editingTransaction ? "Edit Transaction" : "New Transaction"}
              </DialogTitle>
              <DialogDescription>
                {editingTransaction 
                  ? "Update your transaction details below." 
                  : "Enter the details of your new financial activity."}
              </DialogDescription>
            </DialogHeader>
            <TransactionForm 
              categories={categories}
              wallets={wallets}
              onSubmit={handleFormSubmit}
              initialData={editingTransaction || undefined}
              isLoading={createMutation.isPending || updateMutation.isPending}
            />
          </DialogContent>
        </Dialog>

        <ConfirmDialog
          open={!!deleteId}
          onOpenChange={(open) => !open && setDeleteId(null)}
          title="Delete Transaction"
          description="Are you sure you want to delete this transaction? This action cannot be undone and will revert your wallet balance."
          onConfirm={confirmDelete}
          isLoading={deleteMutation.isPending}
        />
      </div>
    </PageContainer>
  );
}
