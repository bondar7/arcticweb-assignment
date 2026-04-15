import { Injectable } from '@nestjs/common';

import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentResponseDto } from './responses/comment-response.dto';
import { toCommentResponse } from './lead.mapper';
import { LeadsService } from './leads.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LeadCommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly leadsService: LeadsService,
  ) {}

  async listComments(id: string): Promise<CommentResponseDto[]> {
    await this.leadsService.findLeadOrThrow(id);

    const comments = await this.prisma.comment.findMany({
      where: { leadId: id },
      orderBy: { createdAt: 'asc' },
    });

    return comments.map(toCommentResponse);
  }

  async createComment(
    id: string,
    dto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    await this.leadsService.findLeadOrThrow(id);

    const comment = await this.prisma.comment.create({
      data: {
        leadId: id,
        text: dto.text,
      },
    });

    return toCommentResponse(comment);
  }
}
