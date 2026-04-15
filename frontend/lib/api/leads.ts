import { apiClient } from '@/lib/api/client';
export {
  leadSortFieldValues,
  leadSortOrderValues,
  leadStatusValues as leadStatuses,
  leadStatusValues,
} from '@/lib/types/leads';
export type {
  CreateCommentInput,
  CreateLeadInput,
  Lead,
  LeadComment,
  LeadListQuery,
  LeadListResponse,
  LeadSortField,
  LeadSortOrder,
  LeadStatus,
  UpdateLeadInput,
} from '@/lib/types/leads';
import type {
  CreateCommentInput,
  CreateLeadInput,
  Lead,
  LeadComment,
  LeadListQuery,
  LeadListResponse,
  UpdateLeadInput,
} from '@/lib/types/leads';

function cleanParams(query: LeadListQuery): LeadListQuery {
  const cleanedQuery: LeadListQuery = {};

  if (query.page !== undefined) {
    cleanedQuery.page = query.page;
  }

  if (query.limit !== undefined) {
    cleanedQuery.limit = query.limit;
  }

  if (query.status !== undefined) {
    cleanedQuery.status = query.status;
  }

  if (typeof query.q === 'string') {
    const cleaned = query.q.trim();
    if (cleaned) {
      cleanedQuery.q = cleaned;
    }
  }

  if (query.sort !== undefined) {
    cleanedQuery.sort = query.sort;
  }

  if (query.order !== undefined) {
    cleanedQuery.order = query.order;
  }

  return cleanedQuery;
}

function leadPath(id: string): string {
  return `/leads/${encodeURIComponent(id)}`;
}

export async function getLeads(
  query: LeadListQuery = {},
  signal?: AbortSignal,
): Promise<LeadListResponse> {
  const response = await apiClient.get<LeadListResponse>('/leads', {
    params: cleanParams(query),
    ...(signal ? { signal } : {}),
  });

  return response.data;
}

export async function getLead(id: string, signal?: AbortSignal): Promise<Lead> {
  const response = await apiClient.get<Lead>(leadPath(id), {
    ...(signal ? { signal } : {}),
  });

  return response.data;
}

export async function createLead(
  payload: CreateLeadInput,
  signal?: AbortSignal,
): Promise<Lead> {
  const response = await apiClient.post<Lead>('/leads', payload, {
    ...(signal ? { signal } : {}),
  });

  return response.data;
}

export async function updateLead(
  id: string,
  payload: UpdateLeadInput,
  signal?: AbortSignal,
): Promise<Lead> {
  const response = await apiClient.patch<Lead>(leadPath(id), payload, {
    ...(signal ? { signal } : {}),
  });

  return response.data;
}

export async function deleteLead(
  id: string,
  signal?: AbortSignal,
): Promise<void> {
  await apiClient.delete(leadPath(id), {
    ...(signal ? { signal } : {}),
  });
}

export async function getLeadComments(
  id: string,
  signal?: AbortSignal,
): Promise<LeadComment[]> {
  const response = await apiClient.get<LeadComment[]>(
    `${leadPath(id)}/comments`,
    {
      ...(signal ? { signal } : {}),
    },
  );

  return response.data;
}

export async function createLeadComment(
  id: string,
  payload: CreateCommentInput,
  signal?: AbortSignal,
): Promise<LeadComment> {
  const response = await apiClient.post<LeadComment>(
    `${leadPath(id)}/comments`,
    payload,
    signal ? { signal } : undefined,
  );

  return response.data;
}
