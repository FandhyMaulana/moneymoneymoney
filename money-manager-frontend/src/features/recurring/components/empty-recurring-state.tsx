"use client";

import { EmptyState } from "@/components/shared/empty-state";
import { Repeat, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyRecurringStateProps {
  onAdd: () => void;
  isSearch?: boolean;
}

export function EmptyRecurringState({ onAdd, isSearch }: EmptyRecurringStateProps) {
  return (
    <EmptyState
      icon={Repeat}
      title={isSearch ? "No matching automations" : "No recurring transactions"}
      description={isSearch 
        ? "We couldn't find any recurring transactions matching your search." 
        : "Automate your finances by setting up recurring income or expenses."
      }
      action={!isSearch ? {
        label: "Set up first automation",
        onClick: onAdd
      } : undefined}
    />
  );
}
