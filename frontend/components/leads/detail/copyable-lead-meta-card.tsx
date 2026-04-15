'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type CopyableLeadMetaCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  copyText?: string;
  copyHint?: string;
  truncateValue?: boolean;
  monospaceValue?: boolean;
};

export function CopyableLeadMetaCard({
  icon,
  label,
  value,
  copyText,
  copyHint = 'Click to copy',
  truncateValue = false,
  monospaceValue = false,
}: CopyableLeadMetaCardProps) {
  const [copied, setCopied] = useState(false);
  const resetTimeoutRef = useRef<number | null>(null);

  const textToCopy = copyText ?? value;
  const canCopy = textToCopy.trim().length > 0;
  const isPlaceholder = value.trim().toLowerCase() === 'not set';

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current !== null) {
        window.clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  async function handleCopy() {
    if (!canCopy) {
      return;
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast.success(`${label} copied`);

      if (resetTimeoutRef.current !== null) {
        window.clearTimeout(resetTimeoutRef.current);
      }

      resetTimeoutRef.current = window.setTimeout(() => {
        setCopied(false);
      }, 1400);
    } catch {
      toast.error('Unable to copy right now.');
    }
  }

  return (
    <button
      type="button"
      className="group relative flex h-full min-h-32 w-full flex-col rounded-lg border border-line/70 bg-background/70 p-4 text-left transition-colors hover:border-line hover:bg-background/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-default disabled:opacity-100"
      onClick={() => void handleCopy()}
      disabled={!canCopy}
      aria-label={canCopy ? `Copy ${label}` : `${label}: ${value}`}
      title={canCopy ? copyHint : 'No data to copy'}
    >
      <div className="pointer-events-none absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-md border border-line/70 bg-surface/95 text-muted-foreground opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">
        {copied ? (
          <Check className="h-3.5 w-3.5 text-brand-ink" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </div>

      <div className="flex h-full flex-col justify-start pr-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {icon}
          {label}
        </div>
        <p
          className={cn(
            'mt-2 min-h-12 text-sm font-semibold leading-6',
            isPlaceholder ? 'font-medium text-muted-foreground' : 'text-foreground',
            truncateValue
              ? 'overflow-hidden text-ellipsis whitespace-nowrap'
              : 'wrap-break-word',
            monospaceValue && 'font-mono text-xs leading-5 tracking-tight',
          )}
        >
          {value}
        </p>
      </div>
    </button>
  );
}
