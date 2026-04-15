import type { Comment, Lead } from '@prisma/client';

import type { CommentResponseDto } from './responses/comment-response.dto';
import type {
  LeadListMetaDto,
  LeadResponseDto,
} from './responses/lead-response.dto';

export function toLeadResponse(lead: Lead): LeadResponseDto {
  return {
    id: lead.id,
    name: lead.name,
    email: lead.email,
    company: lead.company,
    status: lead.status,
    value: lead.value?.toNumber() ?? null,
    notes: lead.notes,
    createdAt: lead.createdAt,
    updatedAt: lead.updatedAt,
  };
}

export function toCommentResponse(comment: Comment): CommentResponseDto {
  return {
    id: comment.id,
    leadId: comment.leadId,
    text: comment.text,
    createdAt: comment.createdAt,
  };
}

export function toListMeta(
  page: number,
  limit: number,
  total: number,
): LeadListMetaDto {
  return {
    page,
    limit,
    total,
    totalPages: total === 0 ? 0 : Math.ceil(total / limit),
  };
}
