import type { LeadListQuery } from '@/lib/api/leads';

import {
  LEADS_DEFAULT_ORDER,
  LEADS_DEFAULT_PAGE,
  LEADS_DEFAULT_SORT,
} from './lead-utils';
import type { LeadsQueryState } from './use-leads-query-state';

export const leadsEmptyStateAction = {
  addFirstLead: 'add-first-lead',
  goToFirstPage: 'go-to-first-page',
  clearFilters: 'clear-filters',
} as const;

export type LeadsEmptyStateAction =
  (typeof leadsEmptyStateAction)[keyof typeof leadsEmptyStateAction];

export type LeadsEmptyState = {
  title: string;
  description: string;
  actionLabel: string;
  action: LeadsEmptyStateAction;
};

export function buildLeadListQuery(query: LeadsQueryState): LeadListQuery {
  return {
    page: query.page,
    limit: query.limit,
    sort: query.sort,
    order: query.order,
    ...(query.q ? { q: query.q } : {}),
    ...(query.status !== 'all' ? { status: query.status } : {}),
  };
}

export function hasActiveLeadFilters(query: LeadsQueryState): boolean {
  return (
    Boolean(query.q) ||
    query.status !== 'all' ||
    query.page !== LEADS_DEFAULT_PAGE ||
    query.sort !== LEADS_DEFAULT_SORT ||
    query.order !== LEADS_DEFAULT_ORDER
  );
}

export function getLeadCountLabel(total: number): string {
  return `${total} ${total === 1 ? 'lead' : 'leads'} in workspace`;
}

export function getLeadsListEmptyState({
  hasActiveFilters,
  page,
  totalPages,
}: {
  hasActiveFilters: boolean;
  page: number;
  totalPages: number;
}): LeadsEmptyState {
  if (totalPages > 0 && page > totalPages) {
    return {
      title: 'This page is empty',
      description:
        'The current page is beyond the available results. Go back to the first page or adjust the filters.',
      actionLabel: 'Go to first page',
      action: leadsEmptyStateAction.goToFirstPage,
    };
  }

  if (hasActiveFilters) {
    return {
      title: 'No leads match these filters',
      description:
        'Try a different search term, change the status filter, or clear the current filters.',
      actionLabel: 'Clear filters',
      action: leadsEmptyStateAction.clearFilters,
    };
  }

  return {
    title: 'No leads yet',
    description:
      'Create the first lead to start tracking contacts, follow-ups, and value.',
    actionLabel: 'Add first lead',
    action: leadsEmptyStateAction.addFirstLead,
  };
}
