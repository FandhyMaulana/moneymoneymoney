"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  transactionSchema, 
  TransactionFormData 
} from "@/types/transaction";
import { Transaction, TransactionType } from "@/types";
import { Category } from "@/services/category.service";
import { Wallet } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { 
  CalendarIcon, 
  Loader2, 
  DollarSign, 
  FileText, 
  Link as LinkIcon 
} from "lucide-react";
import { useEffect } from "react";

interface TransactionFormProps {
  categories: Category[];
  wallets: Wallet[];
  onSubmit: (data: TransactionFormData) => void;
  initialData?: Transaction;
  isLoading?: boolean;
}

export function TransactionForm({ 
  categories, 
  wallets, 
  onSubmit, 
  initialData, 
  isLoading 
}: TransactionFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: initialData ? {
      type: initialData.type,
      amount: initialData.amount,
      category_id: initialData.category_id,
      source_wallet_id: initialData.source_wallet_id,
      destination_wallet_id: initialData.destination_wallet_id,
      reference_no: initialData.reference_no,
      note: initialData.note,
      attachment_url: initialData.attachment_url,
      transaction_date: initialData.transaction_date,
    } : {
      type: "expense",
      amount: 0,
      transaction_date: new Date().toISOString(),
    },
  });

  const type = watch("type");
  const dateValue = watch("transaction_date");

  useEffect(() => {
    if (initialData) {
      reset({
        type: initialData.type,
        amount: initialData.amount,
        category_id: initialData.category_id,
        source_wallet_id: initialData.source_wallet_id,
        destination_wallet_id: initialData.destination_wallet_id,
        reference_no: initialData.reference_no,
        note: initialData.note,
        attachment_url: initialData.attachment_url,
        transaction_date: initialData.transaction_date,
      });
    }
  }, [initialData, reset]);

  const onTypeChange = (newType: string) => {
    setValue("type", newType as TransactionType);
    // Clear wallet fields when switching types to avoid validation issues
    if (newType === "income") {
      setValue("source_wallet_id", null);
    } else if (newType === "expense") {
      setValue("destination_wallet_id", null);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Tabs value={type} onValueChange={onTypeChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-accent/50 p-1 h-11 rounded-xl">
          <TabsTrigger value="expense" className="rounded-lg data-[state=active]:bg-red-500 data-[state=active]:text-white">Expense</TabsTrigger>
          <TabsTrigger value="income" className="rounded-lg data-[state=active]:bg-green-500 data-[state=active]:text-white">Income</TabsTrigger>
          <TabsTrigger value="transfer" className="rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white">Transfer</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Amount */}
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              className={cn("pl-9 h-12 rounded-xl border-none bg-accent/30 text-lg font-bold", errors.amount && "ring-2 ring-destructive")}
              {...register("amount")}
            />
          </div>
          {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
        </div>

        {/* Date */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-12 rounded-xl border-none bg-accent/30 justify-start text-left font-normal px-3",
                  !dateValue && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 size-4" />
                {dateValue ? format(new Date(dateValue), "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-2xl border-none shadow-2xl" align="start">
              <Calendar
                mode="single"
                selected={dateValue ? new Date(dateValue) : undefined}
                onSelect={(date) => setValue("transaction_date", date?.toISOString() || "")}
                initialFocus
                className="rounded-2xl"
              />
            </PopoverContent>
          </Popover>
          {errors.transaction_date && <p className="text-xs text-destructive">{errors.transaction_date.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Wallet Selection */}
        {(type === "expense" || type === "transfer") && (
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {type === "transfer" ? "Source Wallet" : "Wallet"}
            </Label>
            <Select 
              value={watch("source_wallet_id") || ""} 
              onValueChange={(v) => setValue("source_wallet_id", v)}
            >
              <SelectTrigger className="h-12 rounded-xl border-none bg-accent/30">
                <SelectValue placeholder="Select wallet" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-none shadow-2xl">
                {wallets.map((w) => (
                  <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.source_wallet_id && <p className="text-xs text-destructive">{errors.source_wallet_id.message}</p>}
          </div>
        )}

        {(type === "income" || type === "transfer") && (
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {type === "transfer" ? "Destination Wallet" : "Wallet"}
            </Label>
            <Select 
              value={watch("destination_wallet_id") || ""} 
              onValueChange={(v) => setValue("destination_wallet_id", v)}
            >
              <SelectTrigger className="h-12 rounded-xl border-none bg-accent/30">
                <SelectValue placeholder="Select wallet" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-none shadow-2xl">
                {wallets.map((w) => (
                  <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.destination_wallet_id && <p className="text-xs text-destructive">{errors.destination_wallet_id.message}</p>}
          </div>
        )}

        {/* Category */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</Label>
          <Select 
            value={watch("category_id") || ""} 
            onValueChange={(v) => setValue("category_id", v)}
          >
            <SelectTrigger className="h-12 rounded-xl border-none bg-accent/30">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-none shadow-2xl">
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category_id && <p className="text-xs text-destructive">{errors.category_id.message}</p>}
        </div>
      </div>

      {/* Note */}
      <div className="space-y-2">
        <Label htmlFor="note" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Note</Label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <Input
            id="note"
            placeholder="Add a note..."
            className="pl-9 h-12 rounded-xl border-none bg-accent/30"
            {...register("note")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reference No */}
        <div className="space-y-2">
          <Label htmlFor="reference_no" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Reference No</Label>
          <Input
            id="reference_no"
            placeholder="E.g. INV-123"
            className="h-12 rounded-xl border-none bg-accent/30"
            {...register("reference_no")}
          />
        </div>

        {/* Attachment URL */}
        <div className="space-y-2">
          <Label htmlFor="attachment_url" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Attachment URL</Label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="attachment_url"
              placeholder="https://example.com/receipt.jpg"
              className="pl-9 h-12 rounded-xl border-none bg-accent/30"
              {...register("attachment_url")}
            />
          </div>
          {errors.attachment_url && <p className="text-xs text-destructive">{errors.attachment_url.message}</p>}
        </div>
      </div>

      <Button type="submit" className="w-full h-12 rounded-xl font-bold text-lg shadow-lg active:scale-[0.98] transition-all" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 size-5 animate-spin" />
            Saving...
          </>
        ) : (
          initialData ? "Update Transaction" : "Add Transaction"
        )}
      </Button>
    </form>
  );
}
