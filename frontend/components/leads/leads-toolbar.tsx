'use client';

import { ArrowDown, ArrowUp, Search } from 'lucide-react';
import type { FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { leadStatusValues } from '@/lib/types/leads';
import { leadStatusLabels } from './lead-utils';

type LeadsToolbarStatus = 'all' | (typeof leadStatusValues)[number];

type LeadsToolbarProps = {
  q: string;
  onQChange: (value: string) => void;
  status: LeadsToolbarStatus;
  onStatusChange: (value: LeadsToolbarStatus) => void;
  sort: 'createdAt' | 'updatedAt';
  onSortChange: (value: 'createdAt' | 'updatedAt') => void;
  order: 'asc' | 'desc';
  onOrderChange: (value: 'asc' | 'desc') => void;
  onSubmitSearch: (value: string) => void;
  onClearFilters: () => void;
  disabled?: boolean;
};

export function LeadsToolbar({
  q,
  onQChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
  order,
  onOrderChange,
  onSubmitSearch,
  onClearFilters,
  disabled,
}: LeadsToolbarProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmitSearch(q);
  }

  const hasActiveFilters =
    Boolean(q.trim()) ||
    status !== 'all' ||
    sort !== 'createdAt' ||
    order !== 'desc';

  const isNewestFirst = order === 'desc';

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="grid gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(event) => onQChange(event.target.value)}
            placeholder="Search name, email, or company"
            className="pl-9"
            disabled={disabled}
          />
        </div>
        <Button type="submit" disabled={disabled} className="w-full">
          Search
        </Button>
      </form>

      <div className="space-y-3">
        <div className="grid gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Status
          </span>
          <Select
            value={status}
            onValueChange={(value) =>
              onStatusChange(value as LeadsToolbarStatus)
            }
            disabled={Boolean(disabled)}
          >
            <SelectTrigger className="h-10 w-full bg-background/80">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {leadStatusValues.map((item) => (
                <SelectItem key={item} value={item}>
                  {leadStatusLabels[item]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Sort
          </span>

          <div className="grid gap-2">
            <div className="grid w-full grid-cols-2 rounded-lg border border-line/70 bg-background/70 p-1">
              <Button
                type="button"
                size="sm"
                variant={sort === 'updatedAt' ? 'secondary' : 'ghost'}
                className="h-8 rounded-md px-3"
                onClick={() => onSortChange('updatedAt')}
                disabled={disabled}
              >
                Updated
              </Button>
              <Button
                type="button"
                size="sm"
                variant={sort === 'createdAt' ? 'secondary' : 'ghost'}
                className="h-8 rounded-md px-3"
                onClick={() => onSortChange('createdAt')}
                disabled={disabled}
              >
                Created
              </Button>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-10 w-full justify-center px-3"
              onClick={() => onOrderChange(isNewestFirst ? 'asc' : 'desc')}
              disabled={disabled}
            >
              {isNewestFirst ? (
                <ArrowDown className="h-4 w-4" />
              ) : (
                <ArrowUp className="h-4 w-4" />
              )}
              {isNewestFirst ? 'Newest first' : 'Oldest first'}
            </Button>
          </div>
        </div>

        <div className="pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-10 w-full justify-center px-3"
            onClick={onClearFilters}
            disabled={disabled || !hasActiveFilters}
          >
            Clear filters
          </Button>
        </div>
      </div>
    </div>
  );
}
