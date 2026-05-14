"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  recurringSchema, 
  RecurringFormData, 
  RecurringTransaction 
} from "@/types/recurring";
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
  Clock
} from "lucide-react";
import { useEffect } from "react";
import { SchedulePreview } from "./schedule-preview";

interface RecurringFormProps {
  categories: Category[];
  wallets: Wallet[];
  onSubmit: (data: RecurringFormData) => void;
  initialData?: RecurringTransaction;
  isLoading?: boolean;
}

export function RecurringForm({ 
  categories, 
  wallets, 
  onSubmit, 
  initialData, 
  isLoading 
}: RecurringFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<RecurringFormData>({
    resolver: zodResolver(recurringSchema) as any,
    defaultValues: initialData ? {
      type: initialData.type as "income" | "expense",
      amount: initialData.amount,
      category_id: initialData.category_id,
      wallet_id: initialData.wallet_id,
      frequency: initialData.frequency,
      note: initialData.note,
      start_date: initialData.start_date,
      is_active: initialData.is_active,
    } : {
      type: "expense",
      amount: 0,
      frequency: "monthly",
      start_date: new Date().toISOString(),
      is_active: true,
    },
  });

  const type = watch("type");
  const frequency = watch("frequency");
  const startDate = watch("start_date");

  useEffect(() => {
    if (initialData) {
      reset({
        type: initialData.type as "income" | "expense",
        amount: initialData.amount,
        category_id: initialData.category_id,
        wallet_id: initialData.wallet_id,
        frequency: initialData.frequency,
        note: initialData.note,
        start_date: initialData.start_date,
        is_active: initialData.is_active,
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Tabs value={type} onValueChange={(v) => setValue("type", v as "income" | "expense")} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-accent/50 p-1 h-11 rounded-xl">
          <TabsTrigger value="expense" className="rounded-lg data-[state=active]:bg-red-500 data-[state=active]:text-white">Expense</TabsTrigger>
          <TabsTrigger value="income" className="rounded-lg data-[state=active]:bg-green-500 data-[state=active]:text-white">Income</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Frequency</Label>
          <Select 
            value={frequency} 
            onValueChange={(v) => setValue("frequency", v as any)}
          >
            <SelectTrigger className="h-12 rounded-xl border-none bg-accent/30">
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-muted-foreground" />
                <SelectValue placeholder="Select frequency" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-none shadow-2xl">
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          {errors.frequency && <p className="text-xs text-destructive">{errors.frequency.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Wallet</Label>
          <Select 
            value={watch("wallet_id") || ""} 
            onValueChange={(v) => setValue("wallet_id", v)}
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
          {errors.wallet_id && <p className="text-xs text-destructive">{errors.wallet_id.message}</p>}
        </div>

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

      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Start Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full h-12 rounded-xl border-none bg-accent/30 justify-start text-left font-normal px-3",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 size-4" />
              {startDate ? format(new Date(startDate), "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 rounded-2xl border-none shadow-2xl" align="start">
            <Calendar
              mode="single"
              selected={startDate ? new Date(startDate) : undefined}
              onSelect={(date) => setValue("start_date", date?.toISOString() || "")}
              className="rounded-2xl"
            />
          </PopoverContent>
        </Popover>
        {errors.start_date && <p className="text-xs text-destructive">{errors.start_date.message}</p>}
      </div>

      <SchedulePreview frequency={frequency} startDate={startDate} />

      <div className="space-y-2">
        <Label htmlFor="note" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Note</Label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <Input
            id="note"
            placeholder="E.g. Netflix Subscription"
            className="pl-9 h-12 rounded-xl border-none bg-accent/30"
            {...register("note")}
          />
        </div>
      </div>

      <Button type="submit" className="w-full h-12 rounded-xl font-bold text-lg shadow-lg active:scale-[0.98] transition-all" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 size-5 animate-spin" />
            Saving...
          </>
        ) : (
          initialData ? "Update Automation" : "Set Recurring Transaction"
        )}
      </Button>
    </form>
  );
}
