"use client";

import { Card } from "@/components/ui/card";
import { RecurringTransaction } from "@/types/recurring";
import { Wallet } from "@/types";
import { Category } from "@/services/category.service";
import { formatCurrency, formatDate } from "@/utils/format";
import { RecurringStatusBadge } from "./recurring-status-badge";
import { FrequencyBadge } from "./frequency-badge";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  MoreHorizontal, 
  Trash2, 
  Edit2,
  Calendar
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RecurringCardProps {
  recurring: RecurringTransaction;
  wallet?: Wallet;
  category?: Category;
  onEdit: (recurring: RecurringTransaction) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (recurring: RecurringTransaction) => void;
}

export function RecurringCard({ 
  recurring, 
  wallet, 
  category, 
  onEdit, 
  onDelete, 
  onToggleStatus 
}: RecurringCardProps) {
  const isIncome = recurring.type === "income";

  return (
    <Card className="p-6 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className={cn(
              "size-12 rounded-2xl flex items-center justify-center shadow-sm",
              isIncome ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
            )}>
              {isIncome ? <ArrowUpRight className="size-6" /> : <ArrowDownLeft className="size-6" />}
            </div>
            <div>
              <h3 className="font-bold text-primary truncate max-w-[150px] md:max-w-[200px]">
                {recurring.note || category?.name || "Untitled"}
              </h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                {wallet?.name || "No wallet"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <RecurringStatusBadge isActive={recurring.is_active} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8 rounded-full">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl border-none shadow-2xl">
                <DropdownMenuItem onClick={() => onToggleStatus(recurring)} className="gap-2">
                  {recurring.is_active ? <Pause className="size-4" /> : <Play className="size-4" />}
                  {recurring.is_active ? "Pause" : "Activate"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(recurring)} className="gap-2">
                  <Edit2 className="size-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(recurring.id)} className="gap-2 text-destructive focus:text-destructive">
                  <Trash2 className="size-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <div className={cn(
              "text-2xl font-black tracking-tight",
              isIncome ? "text-emerald-600" : "text-rose-600"
            )}>
              {isIncome ? "+" : "-"}{formatCurrency(recurring.amount)}
            </div>
            <FrequencyBadge frequency={recurring.frequency} />
          </div>
          
          <div className="text-right space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Next Execution</p>
            <div className="flex items-center gap-1.5 text-sm font-medium text-primary">
              <Calendar className="size-3.5 text-muted-foreground" />
              {formatDate(recurring.next_run_date)}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

import { Play, Pause } from "lucide-react";
