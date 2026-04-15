import type { ReactNode } from 'react';
import { Suspense } from 'react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function LeadsLayoutFallback() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <Card className="border-line/70 bg-surface/90 shadow-soft">
        <CardHeader className="space-y-3">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </CardContent>
      </Card>

      <Card className="border-line/70 bg-surface/90 shadow-soft">
        <CardHeader className="space-y-3">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-72 w-full" />
        </CardContent>
      </Card>
    </main>
  );
}

export default function LeadsLayout({ children }: { children: ReactNode }) {
  return <Suspense fallback={<LeadsLayoutFallback />}>{children}</Suspense>;
}

