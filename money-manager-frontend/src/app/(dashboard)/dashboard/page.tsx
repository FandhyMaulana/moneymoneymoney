import { DashboardContent } from "@/features/dashboard/components/dashboard-content";
import { PageContainer } from "@/components/shared/page-container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "View your financial overview and spending habits.",
};

export default function DashboardPage() {
  return (
    <PageContainer>
      <DashboardContent />
    </PageContainer>
  );
}
