'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

type LeadsPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function LeadsPagination({
  page,
  totalPages,
  onPageChange,
}: LeadsPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-2 border-t border-line/70 px-4 py-4">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-9 w-9"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Go to previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-9 w-9"
        disabled={page >= totalPages || totalPages === 0}
        onClick={() => onPageChange(page + 1)}
        aria-label="Go to next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
