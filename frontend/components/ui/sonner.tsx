'use client';

import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      closeButton
      position="top-right"
      richColors={false}
      toastOptions={{
        className:
          'rounded-lg border border-line/70 bg-card text-foreground shadow-soft',
      }}
    />
  );
}
