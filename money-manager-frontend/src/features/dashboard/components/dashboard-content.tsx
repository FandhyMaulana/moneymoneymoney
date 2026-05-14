"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService, reportService } from "@/services/dashboard.service";
import { SummaryCard } from "./summary-card";
import { TopExpenseCard } from "./top-expense-card";
import { CategoryBreakdown } from "./category-breakdown";
import { MonthlyTrendChart } from "./monthly-trend-chart";
import { 
  Wallet, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Percent,
  Calendar,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Mock trend data
const mockTrendData = [
  { name: "Jan", income: 4500, expense: 3200 },
  { name: "Feb", income: 5200, expense: 3800 },
  { name: "Mar", income: 4800, expense: 4100 },
  { name: "Apr", income: 6100, expense: 4200 },
  { name: "May", income: 5500, expense: 3900 },
  { name: "Jun", income: 5900, expense: 4300 },
];

export function DashboardContent() {
  const { 
    data: summaryResponse, 
    isLoading: isSummaryLoading,
    refetch: refetchSummary,
    isRefetching: isSummaryRefetching
  } = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: dashboardService.getSummary,
  });

  const now = new Date();
  const { 
    data: reportResponse, 
    isLoading: isReportLoading 
  } = useQuery({
    queryKey: ["monthly-report", now.getMonth() + 1, now.getFullYear()],
    queryFn: () => reportService.getMonthly(now.getMonth() + 1, now.getFullYear()),
  });

  const summary = summaryResponse?.data;
  const report = reportResponse?.data;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <Calendar className="size-4" />
            Overview for {now.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetchSummary()}
            disabled={isSummaryLoading || isSummaryRefetching}
            className="rounded-xl shadow-sm bg-background/50 backdrop-blur-sm"
          >
            <RefreshCw className={cn("size-4 mr-2", isSummaryRefetching && "animate-spin")} />
            Sync Data
          </Button>
        </div>
      </div>

      {/* Summary Section */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={item}>
          <SummaryCard
            title="Total Balance"
            value={summary?.total_balance || 0}
            icon={Wallet}
            description="Across all wallets"
            isLoading={isSummaryLoading}
          />
        </motion.div>
        <motion.div variants={item}>
          <SummaryCard
            title="Monthly Income"
            value={summary?.monthly_income || 0}
            icon={ArrowUpCircle}
            description="Total this month"
            isLoading={isSummaryLoading}
            className="border-l-4 border-l-green-500/20"
          />
        </motion.div>
        <motion.div variants={item}>
          <SummaryCard
            title="Monthly Expense"
            value={summary?.monthly_expense || 0}
            icon={ArrowDownCircle}
            description="Total this month"
            isLoading={isSummaryLoading}
            className="border-l-4 border-l-red-500/20"
          />
        </motion.div>
        <motion.div variants={item}>
          <SummaryCard
            title="Savings Rate"
            value={summary?.savings_rate || 0}
            icon={Percent}
            description="Income vs Expense"
            isLoading={isSummaryLoading}
            trend={{
              value: summary?.savings_rate || 0,
              isPositive: (summary?.savings_rate || 0) > 20
            }}
          />
        </motion.div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-7">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-4"
        >
          <MonthlyTrendChart data={mockTrendData} isLoading={isSummaryLoading} />
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-3"
        >
          <TopExpenseCard 
            category={summary?.top_expense_category || null} 
            isLoading={isSummaryLoading} 
          />
        </motion.div>
      </div>

      {/* Breakdown Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <CategoryBreakdown 
          categories={report?.categories || []} 
          isLoading={isReportLoading} 
        />
      </motion.div>
    </div>
  );
}
