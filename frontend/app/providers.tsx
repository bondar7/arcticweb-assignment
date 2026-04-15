'use client';

import { Toaster } from '@/components/ui/sonner';
import type { ReactNode } from 'react';

export function Providers({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
