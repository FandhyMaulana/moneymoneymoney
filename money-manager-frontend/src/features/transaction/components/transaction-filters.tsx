"use client";

import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  FilterX, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  ArrowRightLeft,
  Wallet as WalletIcon,
  Tag
} from "lucide-react";
import { TransactionType } from "@/types";
import { Category } from "@/services/category.service";
import { Wallet } from "@/types";
import { useEffect, useState, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { debounce } from "lodash";

interface TransactionFiltersProps {
  categories: Category[];
  wallets: Wallet[];
}

export function TransactionFilters({ categories, wallets }: TransactionFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      
      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === "all") {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }
      });

      // Reset to page 1 on filter change
      newSearchParams.set("page", "1");
      
      return newSearchParams.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (key: string, value: string | null) => {
    router.push(`${pathname}?${createQueryString({ [key]: value })}`);
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      router.push(`${pathname}?${createQueryString({ search: value })}`);
    }, 500),
    [createQueryString, pathname, router]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  };

  const handleReset = () => {
    setSearch("");
    router.push(pathname);
  };

  return (
    <div className="flex flex-col gap-6 bg-card p-6 rounded-[var(--radius)] border mb-8 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1 group">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search by note..."
            value={search}
            onChange={onSearchChange}
            className="pl-10 bg-accent/30 border-none h-11 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:flex gap-4">
          {/* Type Filter */}
          <Select
            value={searchParams.get("type") || "all"}
            onValueChange={(v) => handleFilterChange("type", v)}
          >
            <SelectTrigger className="w-full lg:w-[160px] bg-accent/30 border-none h-11 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-none shadow-2xl">
              <SelectItem value="all" className="rounded-lg m-1">All Types</SelectItem>
              <SelectItem value="income" className="rounded-lg m-1">
                <span className="flex items-center gap-2">
                  <ArrowUpCircle className="size-4 text-emerald-500" />
                  Income
                </span>
              </SelectItem>
              <SelectItem value="expense" className="rounded-lg m-1">
                <span className="flex items-center gap-2">
                  <ArrowDownCircle className="size-4 text-rose-500" />
                  Expense
                </span>
              </SelectItem>
              <SelectItem value="transfer" className="rounded-lg m-1">
                <span className="flex items-center gap-2">
                  <ArrowRightLeft className="size-4 text-blue-500" />
                  Transfer
                </span>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Wallet Filter */}
          <Select
            value={searchParams.get("wallet_id") || "all"}
            onValueChange={(v) => handleFilterChange("wallet_id", v)}
          >
            <SelectTrigger className="w-full lg:w-[180px] bg-accent/30 border-none h-11 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium">
              <div className="flex items-center gap-2">
                <WalletIcon className="size-4 text-primary/60" />
                <SelectValue placeholder="All Wallets" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-none shadow-2xl">
              <SelectItem value="all" className="rounded-lg m-1">All Wallets</SelectItem>
              {wallets.map((w) => (
                <SelectItem key={w.id} value={w.id} className="rounded-lg m-1">
                  {w.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select
            value={searchParams.get("category_id") || "all"}
            onValueChange={(v) => handleFilterChange("category_id", v)}
          >
            <SelectTrigger className="w-full lg:w-[180px] bg-accent/30 border-none h-11 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium">
              <div className="flex items-center gap-2">
                <Tag className="size-4 text-primary/60" />
                <SelectValue placeholder="All Categories" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-none shadow-2xl">
              <SelectItem value="all" className="rounded-lg m-1">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id} className="rounded-lg m-1">
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Reset */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleReset}
            className="shrink-0 h-11 w-11 hover:bg-destructive/10 hover:text-destructive transition-all rounded-xl"
            title="Clear all filters"
          >
            <FilterX className="size-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
