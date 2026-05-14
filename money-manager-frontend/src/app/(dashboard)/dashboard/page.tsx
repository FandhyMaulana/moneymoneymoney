import { PageContainer } from "@/components/shared/page-container";
import { SectionHeader } from "@/components/shared/section-header";
import { CardWrapper } from "@/components/shared/card-wrapper";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function DashboardPage() {
  return (
    <PageContainer>
      <SectionHeader 
        title="Dashboard" 
        description="Welcome back! Here's what's happening with your money."
      >
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </SectionHeader>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <CardWrapper title="Total Balance">
          <div className="text-2xl font-bold">$12,450.00</div>
          <p className="text-xs text-muted-foreground">+2.5% from last month</p>
        </CardWrapper>
        <CardWrapper title="Income">
          <div className="text-2xl font-bold text-green-600">$4,200.00</div>
          <p className="text-xs text-muted-foreground">+12% from last month</p>
        </CardWrapper>
        <CardWrapper title="Expenses">
          <div className="text-2xl font-bold text-destructive">$2,150.00</div>
          <p className="text-xs text-muted-foreground">-4% from last month</p>
        </CardWrapper>
        <CardWrapper title="Savings">
          <div className="text-2xl font-bold text-primary">$1,050.00</div>
          <p className="text-xs text-muted-foreground">+5% from last month</p>
        </CardWrapper>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <CardWrapper title="Recent Transactions" className="lg:col-span-2">
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Transaction list will go here
          </div>
        </CardWrapper>
        <CardWrapper title="Budget Overview">
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Budget charts will go here
          </div>
        </CardWrapper>
      </div>
    </PageContainer>
  );
}
