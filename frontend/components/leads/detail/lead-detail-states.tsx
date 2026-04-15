import Link from 'next/link';
import { AlertCircle, ArrowLeft, FileText, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel: string;
  href: string;
  centered?: boolean;
  showContext?: boolean;
};

export function LeadNotFoundState({
  title,
  description,
  actionLabel,
  href,
  centered = false,
  showContext = true,
}: EmptyStateProps) {
  return (
    <Card className="border-line/70 bg-surface/90 shadow-soft">
      <CardHeader className={cn('space-y-4', centered && 'text-center')}>
        {showContext ? (
          <div
            className={cn(
              'flex items-center gap-2 text-sm font-semibold text-muted-foreground',
              centered &&
                'justify-center text-xs font-medium text-muted-foreground/70',
            )}
          >
            <FileText className={cn('h-4 w-4', centered && 'h-3 w-3')} />
            Lead Tracker
          </div>
        ) : null}
        <div className="space-y-2">
          <CardTitle className="text-3xl">{title}</CardTitle>
          <CardDescription
            className={cn(
              'text-base leading-7',
              centered ? 'mx-auto max-w-lg' : 'max-w-xl',
            )}
          >
            {description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent
        className={cn(
          'flex flex-wrap gap-3',
          centered && 'justify-center pt-1',
        )}
      >
        <Button asChild>
          <Link href={href}>
            <ArrowLeft className="h-4 w-4" />
            {actionLabel}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

type ErrorStateProps = {
  title: string;
  description: string;
  onRetry: () => void;
  onBack: () => void;
};

export function LeadErrorState({
  title,
  description,
  onRetry,
  onBack,
}: ErrorStateProps) {
  return (
    <Card className="border-line/70 bg-surface/90 shadow-soft">
      <CardHeader className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <AlertCircle className="h-4 w-4" />
          Unable to load lead
        </div>
        <div className="space-y-2">
          <CardTitle className="text-3xl">{title}</CardTitle>
          <CardDescription className="max-w-xl text-base leading-7">
            {description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        <Button onClick={onRetry}>
          <RefreshCw className="h-4 w-4" />
          Try again
        </Button>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          Back to leads
        </Button>
      </CardContent>
    </Card>
  );
}

export function LeadDetailSkeleton() {
  return (
    <div className="grid gap-6">
      <Card className="border-line/70 bg-surface/90 shadow-soft">
        <CardHeader className="space-y-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-9 w-2/3 max-w-xl" />
          <Skeleton className="h-4 w-1/2 max-w-lg" />
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </CardContent>
      </Card>

      <Card className="border-line/70 bg-surface/90 shadow-soft">
        <CardHeader className="space-y-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="grid gap-4">
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>

      <Card className="border-line/70 bg-surface/90 shadow-soft">
        <CardHeader className="space-y-3">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

export function LeadCommentsLoadingState() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-5 w-28" />
      <Skeleton className="h-4 w-56" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
  );
}

export function LeadCommentsEmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-line/70 bg-background/60 p-4">
      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground">No comments yet</p>
        <p className="text-sm leading-6 text-muted-foreground">
          Add the first note to keep the next follow-up in one place.
        </p>
      </div>
    </div>
  );
}
