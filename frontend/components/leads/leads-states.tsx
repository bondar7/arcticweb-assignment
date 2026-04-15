'use client';

import { AlertCircle, RefreshCcw, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function LeadsLoadingState() {
  return (
    <div className="space-y-3 rounded-lg border border-line/70 bg-background/60 p-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="grid gap-3 rounded-lg border border-line/60 bg-surface/90 p-4 sm:grid-cols-5"
        >
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  );
}

export function LeadsErrorState({
  title,
  description,
  actionLabel = 'Retry',
  onAction,
}: EmptyStateProps) {
  return (
    <div className="space-y-4 py-1">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <p className="text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      {onAction ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAction}
        >
          <RefreshCcw className="h-4 w-4" />
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

export function LeadsEmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="rounded-lg bg-background/60 p-4">
      <div className="flex items-start gap-3">
        <Search className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
        <div className="flex-1 space-y-2">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
            <p className="text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>
          {onAction ? (
            <Button type="button" variant="outline" onClick={onAction}>
              {actionLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
