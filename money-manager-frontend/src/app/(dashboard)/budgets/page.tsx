"use client";

import { useQuery } from "@tanstack/react-query";
import { budgetService } from "@/services/budget.service";
import { BudgetCard } from "@/features/budget/components/budget-card";
import { BudgetAlert } from "@/features/budget/components/budget-alert";
import { BudgetSkeleton } from "@/features/budget/components/budget-skeleton";
import { PageContainer } from "@/components/shared/page-container";
import { SectionHeader } from "@/components/shared/section-header";
import { EmptyState } from "@/components/shared/empty-state";
import { PieChart, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo } from "react";

export default function BudgetsPage() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const { data: summaryResponse, isLoading, error } = useQuery({
    queryKey: ["budget-summary", month, year],
    queryFn: () => budgetService.getSummary(month, year),
  });

  const budgets = useMemo(() => summaryResponse?.data?.budgets || [], [summaryResponse]);
  const alerts = useMemo(() => budgets.filter(b => b.status !== 'safe'), [budgets]);

  if (isLoading) {
    return (
      <PageContainer>
        <SectionHeader 
          title="Budgets" 
          description="Track your spending against your limits." 
        />
        <BudgetSkeleton />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <EmptyState
          icon={AlertCircle}
          title="Error loading budgets"
          description="We couldn't load your budget data. Please try again later."
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8 pb-12">
        <SectionHeader 
          title="Budgets" 
          description={`Track your spending for ${now.toLocaleString('default', { month: 'long', year: 'numeric' })}`}
        />

        {alerts.length > 0 && (
          <div className="flex flex-col gap-3">
            {alerts.map((budget) => (
              <BudgetAlert 
                key={budget.id} 
                message={budget.alert || ""} 
                type={budget.status === 'exceeded' ? 'exceeded' : 'warning'} 
              />
            ))}
          </div>
        )}

        {budgets.length === 0 ? (
          <EmptyState
            icon={PieChart}
            title="No budgets set"
            description="You haven't set any budgets for this month yet. Start tracking your spending by setting limits."
          />
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {budgets.map((budget) => (
              <BudgetCard key={budget.id} budget={budget} />
            ))}
          </motion.div>
        )}
      </div>
    </PageContainer>
  );
}
