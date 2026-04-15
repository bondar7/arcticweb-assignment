'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import type {
  LeadSortField,
  LeadSortOrder,
  LeadStatus,
} from '@/lib/types/leads';
import {
  LEADS_DEFAULT_PAGE,
  LEADS_PAGE_SIZE,
  buildSearchParams,
  isLeadStatus,
  parseOrder,
  parsePositiveInteger,
  parseSort,
} from './lead-utils';

export type LeadsQueryState = {
  q: string;
  status: LeadStatus | 'all';
  page: number;
  limit: number;
  sort: LeadSortField;
  order: LeadSortOrder;
};

function parseLeadsQuery(searchKey: string): LeadsQueryState {
  const searchParams = new URLSearchParams(searchKey);
  const q = searchParams.get('q')?.trim() ?? '';
  const rawStatus = searchParams.get('status');

  return {
    q,
    status: isLeadStatus(rawStatus) ? rawStatus : 'all',
    page: parsePositiveInteger(searchParams.get('page'), LEADS_DEFAULT_PAGE),
    limit: LEADS_PAGE_SIZE,
    sort: parseSort(searchParams.get('sort')),
    order: parseOrder(searchParams.get('order')),
  };
}

function buildUrl(pathname: string, params: URLSearchParams): string {
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function useLeadsQueryState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();
  const query = useMemo(() => parseLeadsQuery(searchKey), [searchKey]);
  const [draftSearch, setDraftSearch] = useState(query.q);

  useEffect(() => {
    setDraftSearch(query.q);
  }, [query.q]);

  function updateUrl(next: Partial<LeadsQueryState>, resetPage = false) {
    const status = next.status ?? query.status;
    const q = next.q ?? query.q;
    const page = resetPage ? LEADS_DEFAULT_PAGE : (next.page ?? query.page);
    const limit = next.limit ?? query.limit;
    const sort = next.sort ?? query.sort;
    const order = next.order ?? query.order;

    const params = buildSearchParams({
      q,
      status: status === 'all' ? undefined : status,
      page,
      limit,
      sort,
      order,
    });

    router.replace(buildUrl(pathname, params), { scroll: false });
  }

  function clearFilters() {
    setDraftSearch('');
    router.replace(pathname, { scroll: false });
  }

  return {
    query,
    draftSearch,
    setDraftSearch,
    updateUrl,
    clearFilters,
  };
}
