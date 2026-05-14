"use client";

import { useQuery } from "@tanstack/react-query";
import { reportService } from "@/services/report.service";
import { PageContainer } from "@/components/shared/page-container";
import { SectionHeader } from "@/components/shared/section-header";
import { AnalyticsChartCard } from "@/features/analytics/components/analytics-chart-card";
import { CategoryPieChart } from "@/features/analytics/components/category-pie-chart";
import { MonthlyTrendLineChart } from "@/features/analytics/components/monthly-trend-line-chart";
import { SpendingInsight } from "@/features/analytics/components/spending-insight";
import { SavingsSummary } from "@/features/analytics/components/savings-summary";
import { AnalyticsSkeleton } from "@/features/analytics/components/analytics-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { BarChart3, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo } from "react";

// Mock data for the trend chart (Income vs Expense vs Savings)
const mockTrendData = [
  { name: "Jan", income: 4500, expense: 3200, savings: 1300 },
  { name: "Feb", income: 5200, expense: 3800, savings: 1400 },
  { name: "Mar", income: 4800, expense: 4100, savings: 700 },
  { name: "Apr", income: 6100, expense: 4200, savings: 1900 },
  { name: "May", income: 5500, expense: 3900, savings: 1600 },
  { name: "Jun", income: 5900, expense: 4300, savings: 1600 },
];

export default function AnalyticsPage() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const { data: reportResponse, isLoading, error } = useQuery({
    queryKey: ["monthly-report", month, year],
    queryFn: () => reportService.getMonthlyReport(month, year),
  });

  const report = reportResponse?.data;
  const categories = useMemo(() => report?.categories || [], [report]);
  const topCategory = useMemo(() => categories.length > 0 ? categories[0] : null, [categories]);

  if (isLoading) {
    return (
      <PageContainer>
        <SectionHeader 
          title="Analytics" 
          description="Deep insights into your spending habits." 
        />
        <AnalyticsSkeleton />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <EmptyState
          icon={AlertCircle}
          title="Error loading analytics"
          description="We couldn't load your financial report. Please try again later."
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8 pb-12">
        <SectionHeader 
          title="Analytics" 
          description={`Financial overview for ${now.toLocaleString('default', { month: 'long', year: 'numeric' })}`}
        />

        {/* Top Insights */}
        <div className="grid gap-6 md:grid-cols-2">
          {report && (
            <>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <SavingsSummary 
                  income={report.income} 
                  expense={report.expense} 
                  savings={report.savings} 
                />
              </motion.div>
              {topCategory && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <SpendingInsight 
                    categoryName={topCategory.name}
                    amount={topCategory.amount}
                    percentage={topCategory.percentage}
                    totalExpense={report.expense}
                  />
                </motion.div>
              )}
            </>
          )}
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AnalyticsChartCard 
              title="Spending Distribution" 
              subtitle="Expenses by category"
            >
              <CategoryPieChart data={categories} />
            </AnalyticsChartCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <AnalyticsChartCard 
              title="Financial Trend" 
              subtitle="Income vs Expenses vs Savings"
            >
              <MonthlyTrendLineChart data={mockTrendData} />
            </AnalyticsChartCard>
          </motion.div>
        </div>

        {categories.length === 0 && (
          <EmptyState
            icon={BarChart3}
            title="No data to analyze"
            description="You don't have any transactions this month. Start adding transactions to see your analytics."
          />
        )}
      </div>
    </PageContainer>
  );
}
