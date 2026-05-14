"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ArrowRightLeft,
  PieChart,
  BarChart3,
  Repeat,
} from "lucide-react";

const navigation = [
  { name: "Home", href: "/dashboard", icon: LayoutDashboard },
  { name: "Activity", href: "/transactions", icon: ArrowRightLeft },
  { name: "Budgets", href: "/budgets", icon: PieChart },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Recurring", href: "/recurring", icon: Repeat },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-background/80 backdrop-blur-lg border-t pb-safe">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "inline-flex flex-col items-center justify-center px-2 transition-all active:scale-90",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className={cn("size-6", isActive ? "fill-primary/10" : "")} />
              <span className="text-[10px] mt-1 font-semibold tracking-wide uppercase">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
