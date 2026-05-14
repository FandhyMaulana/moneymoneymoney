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
    <div className="flex flex-col gap-4 bg-card p-4 rounded-2xl border mb-6 shadow-sm">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by note..."
            value={search}
            onChange={onSearchChange}
            className="pl-9 bg-accent/30 border-none h-10 rounded-xl focus-visible:ring-1"
          />
        </div>

        {/* Type Filter */}
        <Select
          value={searchParams.get("type") || "all"}
          onValueChange={(v) => handleFilterChange("type", v)}
        >
          <SelectTrigger className="w-full md:w-[160px] bg-accent/30 border-none h-10 rounded-xl">
            <div className="flex items-center gap-2">
              <SelectValue placeholder="All Types" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="income">
              <span className="flex items-center gap-2">
                <ArrowUpCircle className="size-4 text-green-500" />
                Income
              </span>
            </SelectItem>
            <SelectItem value="expense">
              <span className="flex items-center gap-2">
                <ArrowDownCircle className="size-4 text-red-500" />
                Expense
              </span>
            </SelectItem>
            <SelectItem value="transfer">
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
          <SelectTrigger className="w-full md:w-[180px] bg-accent/30 border-none h-10 rounded-xl">
            <div className="flex items-center gap-2">
              <WalletIcon className="size-4 text-muted-foreground" />
              <SelectValue placeholder="All Wallets" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Wallets</SelectItem>
            {wallets.map((w) => (
              <SelectItem key={w.id} value={w.id}>
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
          <SelectTrigger className="w-full md:w-[180px] bg-accent/30 border-none h-10 rounded-xl">
            <div className="flex items-center gap-2">
              <Tag className="size-4 text-muted-foreground" />
              <SelectValue placeholder="All Categories" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
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
          className="shrink-0 hover:bg-destructive/10 hover:text-destructive transition-colors rounded-xl"
        >
          <FilterX className="size-5" />
        </Button>
      </div>
    </div>
  );
}
