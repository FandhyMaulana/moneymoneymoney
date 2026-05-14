"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { recurringService } from "@/services/recurring.service";
import { walletService } from "@/services/wallet.service";
import { categoryService } from "@/services/category.service";
import { PageContainer } from "@/components/shared/page-container";
import { SectionHeader } from "@/components/shared/section-header";
import { RecurringCard } from "@/features/recurring/components/recurring-card";
import { RecurringSkeleton } from "@/features/recurring/components/recurring-skeleton";
import { RecurringForm } from "@/features/recurring/components/recurring-form";
import { EmptyRecurringState } from "@/features/recurring/components/empty-recurring-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Pagination } from "@/components/shared/pagination";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Repeat, AlertCircle } from "lucide-react";
import { useState, useMemo } from "react";
import { RecurringTransaction, RecurringFormData } from "@/types/recurring";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import debounce from "lodash/debounce";

export default function RecurringPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecurring, setEditingRecurring] = useState<RecurringTransaction | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Queries
  const { data: recurringResponse, isLoading, isError } = useQuery({
    queryKey: ["recurring-transactions", page, search],
    queryFn: () => recurringService.getAll({ page, limit: 9, search }),
  });

  const { data: walletsResponse } = useQuery({
    queryKey: ["wallets"],
    queryFn: () => walletService.getAll({ limit: 100 }),
  });

  const { data: categoriesResponse } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getAll({ limit: 100 }),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: recurringService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-transactions"] });
      toast.success("Recurring transaction created successfully");
      handleCloseForm();
    },
    onError: () => toast.error("Failed to create recurring transaction"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RecurringFormData> }) => 
      recurringService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-transactions"] });
      toast.success("Automation updated successfully");
      handleCloseForm();
    },
    onError: () => toast.error("Failed to update automation"),
  });

  const deleteMutation = useMutation({
    mutationFn: recurringService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-transactions"] });
      toast.success("Automation deleted");
    },
    onError: () => toast.error("Failed to delete automation"),
  });

  // Handlers
  const handleAdd = () => {
    setEditingRecurring(null);
    setIsFormOpen(true);
  };

  const handleEdit = (recurring: RecurringTransaction) => {
    setEditingRecurring(recurring);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingRecurring(null);
  };

  const handleToggleStatus = (recurring: RecurringTransaction) => {
    updateMutation.mutate({ 
      id: recurring.id, 
      data: { is_active: !recurring.is_active } 
    });
  };

  const onSubmit = (data: RecurringFormData) => {
    if (editingRecurring) {
      updateMutation.mutate({ id: editingRecurring.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleSearch = useMemo(
    () => debounce((value: string) => {
      setSearch(value);
      setPage(1);
    }, 500),
    []
  );

  const recurringItems = recurringResponse?.data || [];
  const pagination = recurringResponse?.pagination;
  const wallets = walletsResponse?.data || [];
  const categories = categoriesResponse?.data || [];

  return (
    <PageContainer>
      <div className="space-y-8 pb-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <SectionHeader 
              title="Recurring" 
              description="Manage and monitor your automated transactions." 
              className="mb-0"
            />
          </div>
          <Button onClick={handleAdd} className="rounded-xl gap-2 h-11 px-6 shadow-lg shadow-primary/20">
            <Plus className="size-4" />
            New Automation
          </Button>
        </div>

        <div className="relative max-w-md group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search automations..." 
            className="pl-9 h-11 rounded-xl bg-accent/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {isLoading ? (
          <RecurringSkeleton />
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="size-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="size-8 text-destructive" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Something went wrong</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">We encountered an error while fetching your automations. Please try again.</p>
            </div>
            <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ["recurring-transactions"] })}>
              Retry
            </Button>
          </div>
        ) : recurringItems.length === 0 ? (
          <EmptyRecurringState onAdd={handleAdd} isSearch={!!search} />
        ) : (
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {recurringItems.map((recurring) => (
                <RecurringCard
                  key={recurring.id}
                  recurring={recurring}
                  wallet={wallets.find(w => w.id === recurring.wallet_id)}
                  category={categories.find(c => c.id === recurring.category_id)}
                  onEdit={handleEdit}
                  onDelete={setDeleteId}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </motion.div>
            
            {pagination && pagination.total_pages > 1 && (
              <Pagination
                page={page}
                totalPages={pagination.total_pages}
                onPageChange={setPage}
              />
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Automation"
        description="Are you sure you want to delete this recurring automation? This will stop all future transactions from being created automatically."
        onConfirm={() => {
          if (deleteId) {
            deleteMutation.mutate(deleteId);
            setDeleteId(null);
          }
        }}
        isLoading={deleteMutation.isPending}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-3xl border-none shadow-2xl overflow-hidden p-0">
          <div className="bg-primary/5 p-6 border-b border-primary/10">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="size-10 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                  <Repeat className="size-5" />
                </div>
                <DialogTitle className="text-2xl font-bold">
                  {editingRecurring ? "Edit Automation" : "New Automation"}
                </DialogTitle>
              </div>
              <DialogDescription>
                {editingRecurring 
                  ? "Adjust your recurring transaction settings." 
                  : "Set up a new automated transaction schedule."}
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            <RecurringForm
              categories={categories}
              wallets={wallets}
              initialData={editingRecurring || undefined}
              onSubmit={onSubmit}
              isLoading={createMutation.isPending || updateMutation.isPending}
            />
          </div>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
