export const leadStatusValues = [
  'NEW',
  'CONTACTED',
  'IN_PROGRESS',
  'WON',
  'LOST',
] as const;

export type LeadStatus = (typeof leadStatusValues)[number];

export const leadSortFieldValues = ['createdAt', 'updatedAt'] as const;

export type LeadSortField = (typeof leadSortFieldValues)[number];

export const leadSortOrderValues = ['asc', 'desc'] as const;

export type LeadSortOrder = (typeof leadSortOrderValues)[number];

export type Lead = {
  id: string;
  name: string;
  email: string | null;
  company: string | null;
  status: LeadStatus;
  value: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LeadComment = {
  id: string;
  leadId: string;
  text: string;
  createdAt: string;
};

export type LeadListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type LeadListResponse = {
  data: Lead[];
  meta: LeadListMeta;
};

export type LeadListQuery = {
  page?: number;
  limit?: number;
  status?: LeadStatus;
  q?: string;
  sort?: LeadSortField;
  order?: LeadSortOrder;
};

export type CreateLeadInput = {
  name: string;
  email?: string;
  company?: string;
  status?: LeadStatus;
  value?: number;
  notes?: string;
};

export type UpdateLeadInput = {
  name?: string;
  email?: string | null;
  company?: string | null;
  status?: LeadStatus;
  value?: number | null;
  notes?: string | null;
};

export type CreateCommentInput = {
  text: string;
};
