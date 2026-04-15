import type { LeadStatus } from '@prisma/client';

import type { LeadSortField, SortOrder } from '../dto/list-leads-query.dto';

export interface LeadListOptions {
  page: number;
  limit: number;
  status?: LeadStatus;
  q?: string;
  sort: LeadSortField;
  order: SortOrder;
}
