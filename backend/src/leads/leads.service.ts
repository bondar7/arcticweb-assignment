import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Lead } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import {
  LeadListResponseDto,
  LeadResponseDto,
} from './responses/lead-response.dto';
import { toLeadResponse, toListMeta } from './lead.mapper';
import { LeadListOptions } from './types/lead-list-options';

@Injectable()
export class LeadsService {
  constructor(private readonly prisma: PrismaService) {}

  async listLeads(query: LeadListOptions): Promise<LeadListResponseDto> {
    const search = query.q?.trim();

    const where: Prisma.LeadWhereInput = {
      ...(query.status ? { status: query.status } : {}),
      ...(search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                email: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                company: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {}),
    };

    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;
    const orderBy: Prisma.LeadOrderByWithRelationInput = {
      [query.sort]: query.order,
    };

    const [total, leads] = await this.prisma.$transaction([
      this.prisma.lead.count({ where }),
      this.prisma.lead.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
    ]);

    return {
      data: leads.map(toLeadResponse),
      meta: toListMeta(page, limit, total),
    };
  }

  async createLead(dto: CreateLeadDto): Promise<LeadResponseDto> {
    const lead = await this.prisma.lead.create({
      data: {
        name: dto.name,
        ...(dto.email !== undefined ? { email: dto.email } : {}),
        ...(dto.company !== undefined ? { company: dto.company } : {}),
        ...(dto.status !== undefined ? { status: dto.status } : {}),
        ...(dto.value !== undefined ? { value: dto.value } : {}),
        ...(dto.notes !== undefined ? { notes: dto.notes } : {}),
      },
    });

    return toLeadResponse(lead);
  }

  async getLead(id: string): Promise<LeadResponseDto> {
    const lead = await this.findLeadOrThrow(id);

    return toLeadResponse(lead);
  }

  async updateLead(id: string, dto: UpdateLeadDto): Promise<LeadResponseDto> {
    await this.findLeadOrThrow(id);

    const lead = await this.prisma.lead.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.email !== undefined ? { email: dto.email } : {}),
        ...(dto.company !== undefined ? { company: dto.company } : {}),
        ...(dto.status !== undefined ? { status: dto.status } : {}),
        ...(dto.value !== undefined ? { value: dto.value } : {}),
        ...(dto.notes !== undefined ? { notes: dto.notes } : {}),
      },
    });

    return toLeadResponse(lead);
  }

  async deleteLead(id: string): Promise<void> {
    await this.findLeadOrThrow(id);

    await this.prisma.lead.delete({
      where: { id },
    });
  }

  async findLeadOrThrow(id: string): Promise<Lead> {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    return lead;
  }
}
