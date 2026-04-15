import type {
  LeadSortField,
  LeadSortOrder,
  LeadStatus,
} from '@/lib/types/leads';
import { leadStatusValues } from '@/lib/types/leads';

export const LEADS_DEFAULT_PAGE = 1;
export const LEADS_PAGE_SIZE = 10;
export const LEADS_DEFAULT_SORT: LeadSortField = 'createdAt';
export const LEADS_DEFAULT_ORDER: LeadSortOrder = 'desc';

export const leadStatusLabels: Record<LeadStatus, string> = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  IN_PROGRESS: 'In progress',
  WON: 'Won',
  LOST: 'Lost',
};

export function isLeadStatus(value: string | null): value is LeadStatus {
  return Boolean(value && leadStatusValues.includes(value as LeadStatus));
}

export function parsePositiveInteger(value: string | null, fallback: number) {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return parsed;
}

export function parseSort(value: string | null): LeadSortField {
  return value === 'updatedAt' ? 'updatedAt' : LEADS_DEFAULT_SORT;
}

export function parseOrder(value: string | null): LeadSortOrder {
  return value === 'asc' ? 'asc' : LEADS_DEFAULT_ORDER;
}

export function formatLeadValue(value: number | null) {
  if (value === null) return '—';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(value);
}

export function sanitizeLeadValueInput(value: string) {
  return value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
}

export function formatLeadDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function getLeadStatusClassName(status: LeadStatus) {
  switch (status) {
    case 'NEW':
      return 'border-transparent bg-brand text-brand-foreground';
    case 'CONTACTED':
      return 'border-transparent bg-secondary text-secondary-foreground';
    case 'IN_PROGRESS':
      return 'border-line bg-brand-soft text-brand-ink';
    case 'WON':
      return 'border-transparent bg-cyan-soft text-cyan-foreground';
    case 'LOST':
      return 'border-destructive/20 bg-destructive/10 text-destructive';
  }
}

export function buildSearchParams({
  q,
  status,
  page,
  limit,
  sort,
  order,
}: {
  q: string | undefined;
  status: string | undefined;
  page: number;
  limit: number;
  sort: LeadSortField;
  order: LeadSortOrder;
}) {
  const params = new URLSearchParams();

  if (q?.trim()) params.set('q', q.trim());
  if (status) params.set('status', status);
  params.set('page', String(page));
  params.set('limit', String(limit));
  params.set('sort', sort);
  params.set('order', order);

  return params;
}
