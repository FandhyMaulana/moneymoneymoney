import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight 
} from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function Pagination({ 
  page, 
  totalPages, 
  onPageChange, 
  isLoading 
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-2 py-6 border-t mt-4">
      <div className="flex-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        Page <span className="text-foreground financial-data">{page}</span> of <span className="text-foreground financial-data">{totalPages}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          className="hidden size-9 rounded-xl border-none bg-accent/30 lg:flex"
          onClick={() => onPageChange(1)}
          disabled={page === 1 || isLoading}
        >
          <ChevronsLeft className="size-4" />
        </Button>
        <Button
          variant="outline"
          className="size-9 rounded-xl border-none bg-accent/30"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1 || isLoading}
        >
          <ChevronLeft className="size-4" />
        </Button>
        <div className="flex items-center justify-center min-w-9 h-9 rounded-xl bg-primary/10 text-primary text-xs font-black financial-data px-3">
          {page}
        </div>
        <Button
          variant="outline"
          className="size-9 rounded-xl border-none bg-accent/30"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages || isLoading}
        >
          <ChevronRight className="size-4" />
        </Button>
        <Button
          variant="outline"
          className="hidden size-9 rounded-xl border-none bg-accent/30 lg:flex"
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages || isLoading}
        >
          <ChevronsRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
